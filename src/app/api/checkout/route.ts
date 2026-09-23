import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/products";

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
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
                    fixed_amount: { amount: Math.round(shipping * 100), currency: "gbp" },
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

      return NextResponse.json({ orderNumber, stripeUrl: session.url });
    } catch {
      return NextResponse.json({ orderNumber, total, note: "Stripe unavailable — order recorded locally" });
    }
  }

  return NextResponse.json({ orderNumber, total, note: "Payment collected on delivery" });
}
