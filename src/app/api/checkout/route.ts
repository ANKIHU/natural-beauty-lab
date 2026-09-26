import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/products";
import { getSupabase } from "@/lib/supabase";

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

async function saveOrderToDatabase(
  orderNumber: string,
  customer: { name: string; email: string; address: string; city: string; country: string; note: string },
  items: { id: string; qty: number }[],
  subtotalCents: number,
  shippingCents: number,
  totalCents: number,
  stripeSessionId?: string,
) {
  try {
    const supabase = getSupabase();

    // Upsert customer (find or create by email)
    const { data: customerRow } = await supabase
      .from("customers")
      .upsert(
        {
          email: customer.email.toLowerCase().trim(),
          name: customer.name.trim(),
          address: customer.address.trim() || null,
          city: customer.city.trim() || null,
          country: customer.country.trim() || "United Kingdom",
          notes: customer.note.trim() || null,
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (!customerRow) return;

    // Create order
    const { data: orderRow } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerRow.id,
        status: "pending",
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        total_cents: totalCents,
        currency: "GBP",
        stripe_checkout_session_id: stripeSessionId || null,
        delivery_name: customer.name.trim(),
        delivery_email: customer.email.trim(),
        delivery_address: customer.address.trim() || null,
        delivery_city: customer.city.trim() || null,
        delivery_country: customer.country.trim() || "United Kingdom",
        delivery_note: customer.note.trim() || null,
      })
      .select("id")
      .single();

    if (!orderRow) return;

    // Create order items
    const orderItems = items.map((item) => {
      const product = getProductById(item.id);
      return {
        order_id: orderRow.id,
        product_id: item.id,
        product_name: product?.name || "Unknown Product",
        quantity: item.qty,
        unit_price_cents: Math.round((product?.price || 0) * 100),
        line_total_cents: Math.round((product?.price || 0) * item.qty * 100),
      };
    });

    await supabase.from("order_items").insert(orderItems);

    // Update customer stats
    await supabase
      .from("customers")
      .update({
        order_count: (await supabase.from("orders").select("id", { count: "exact", head: true }).eq("customer_id", customerRow.id)).count || 0,
        total_spent_cents: totalCents,
        last_order_at: new Date().toISOString(),
      })
      .eq("id", customerRow.id);

  } catch (err) {
    // Database save should never block checkout — log and continue
    console.error("[checkout] DB save failed:", err);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { customer, items } = body as {
    customer: { name: string; email: string; address: string; city: string; country: string; note: string };
    items: { id: string; qty: number }[];
  };

  if (!items?.length || !customer?.name || !customer?.email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const orderNumber = "NBL-" + Date.now().toString(36).toUpperCase().slice(-6);

  const subtotalCents = Math.round(subtotal * 100);
  const shippingCents = Math.round(shipping * 100);
  const totalCents = Math.round(total * 100);

  const stripe = getStripe();
  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: customer.email,
        line_items: items.map((item) => {
          const product = getProductById(item.id);
          return {
            price_data: {
              currency: "gbp",
              product_data: { name: product?.name || "Product" },
              unit_amount: Math.round((product?.price || 0) * 100),
            },
            quantity: item.qty,
          };
        }),
        ...(shipping > 0
          ? {
              shipping_options: [
                {
                  shipping_rate_data: {
                    type: "fixed_amount" as const,
                    fixed_amount: { amount: shippingCents, currency: "gbp" },
                    display_name: "Standard shipping",
                  },
                },
              ],
            }
          : {}),
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/shop?order=${orderNumber}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/shop`,
        metadata: {
          orderNumber,
          customerName: customer.name,
          address: customer.address,
          city: customer.city,
          country: customer.country,
          note: customer.note,
        },
      });

      // Save to database (non-blocking)
      await saveOrderToDatabase(orderNumber, customer, items, subtotalCents, shippingCents, totalCents, session.id);

      return NextResponse.json({ orderNumber, stripeUrl: session.url });
    } catch {
      // Save even if Stripe fails
      await saveOrderToDatabase(orderNumber, customer, items, subtotalCents, shippingCents, totalCents);
      return NextResponse.json({ orderNumber, total, note: "Stripe unavailable — order recorded" });
    }
  }

  // No Stripe — still save to database
  await saveOrderToDatabase(orderNumber, customer, items, subtotalCents, shippingCents, totalCents);
  return NextResponse.json({ orderNumber, total, note: "Payment collected on delivery" });
}
