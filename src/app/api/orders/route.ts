import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendShippingNotificationEmail } from "@/lib/email";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customerId");

  const supabase = getSupabase();
  let query = supabase
    .from("orders")
    .select("*, order_items(*), customers(name, email)")
    .order("created_at", { ascending: false });

  if (customerId) {
    query = query.eq("customer_id", customerId);
  }

  const { data, error } = await query.limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status, trackingCarrier, trackingNumber, trackingUrl } = body;
  if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 });

  const supabase = getSupabase();

  const updates: Record<string, unknown> = { status };
  if (status === "shipped") updates.shipped_at = new Date().toISOString();
  if (status === "delivered") updates.delivered_at = new Date().toISOString();
  if (status === "cancelled") updates.cancelled_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send shipping notification when status changes to shipped
  if (status === "shipped" && data) {
    sendShippingNotificationEmail(data, {
      carrier: trackingCarrier,
      trackingNumber,
      trackingUrl,
    }).catch((err: any) => console.error("[orders] Shipping email failed:", err.message));
  }

  return NextResponse.json({ order: data });
}
