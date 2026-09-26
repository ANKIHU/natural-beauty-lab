import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";
import { sendOrderConfirmationEmail, sendBusinessNotificationEmail, sendShippingNotificationEmail } from "@/lib/email";

// Stripe webhook handler — server-side payment confirmation
// Payment is NOT confirmed by browser redirect. It is confirmed HERE.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Idempotency: check if we've already processed this event
  const { data: existing } = await supabase
    .from("webhook_events")
    .select("id")
    .eq("stripe_event_id", event.id)
    .single();

  if (existing) {
    return NextResponse.json({ received: true, status: "already_processed" });
  }

  // Record the event (idempotency guard)
  await supabase.from("webhook_events").insert({
    stripe_event_id: event.id,
    event_type: event.type,
    processing_status: "processing",
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber = session.metadata?.orderNumber;

        if (!orderNumber) break;

        // Update order status to PAID
        const { data: order } = await supabase
          .from("orders")
          .update({
            status: "processing",
            stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
            stripe_payment_status: session.payment_status,
            paid_at: new Date().toISOString(),
          })
          .eq("order_number", orderNumber)
          .select("*, order_items(*)")
          .single();

        if (order) {
          // Update customer first_order_at if first order
          await supabase
            .from("customers")
            .update({ first_order_at: new Date().toISOString() })
            .eq("id", order.customer_id)
            .is("first_order_at", null);

          // Send customer confirmation email
          await sendOrderConfirmationEmail(order).catch((err: any) =>
            console.error("[webhook] Customer email failed:", err.message)
          );

          // Send business notification email
          await sendBusinessNotificationEmail(order).catch((err: any) =>
            console.error("[webhook] Business email failed:", err.message)
          );

          // Decrement inventory
          // Note: inventory is in-memory (products.ts) — cannot persist stock
          // changes across deployments. Logged for now; future: move to Supabase.
          console.log(`[webhook] Order ${orderNumber} paid. Items:`,
            (order.order_items || []).map((i: any) => `${i.quantity}× ${i.product_name}`).join(", "));
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
        if (paymentIntentId) {
          await supabase
            .from("orders")
            .update({
              status: "refunded",
              stripe_payment_status: "refunded",
            })
            .eq("stripe_payment_intent_id", paymentIntentId);
        }
        break;
      }
    }

    // Mark event as processed
    await supabase
      .from("webhook_events")
      .update({ processing_status: "processed" })
      .eq("stripe_event_id", event.id);

  } catch (err: any) {
    console.error("[webhook] Processing error:", err.message);
    await supabase
      .from("webhook_events")
      .update({ processing_status: "failed", error_message: err.message })
      .eq("stripe_event_id", event.id);
  }

  return NextResponse.json({ received: true });
}
