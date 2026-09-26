// =============================================================================
// EMAIL SERVICE — order notifications via Resend
// =============================================================================
// Business notification: sent when a new paid order arrives
// Customer confirmation: sent after successful payment
// Shipping notification: sent when order marked shipped
// =============================================================================

import { Resend } from "resend";

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = process.env.ORDER_FROM_EMAIL || "orders@thenaturalbeautylab.com";
const BUSINESS_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || "";
const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://thenaturalbeautylab.com";

function formatMoney(cents: number): string {
  return "£" + (cents / 100).toFixed(2);
}

function orderItemsHtml(items: any[]): string {
  return items.map((i: any) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.product_name}</td>
     <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
     <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatMoney(i.line_total_cents)}</td></tr>`
  ).join("");
}

function emailTemplate(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F4EC;font-family:system-ui,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #D8D2C2;">
<div style="background:#1B2E23;padding:24px 32px;">
<p style="color:#C1922F;font-size:20px;font-weight:700;margin:0;">Natural Beauty Lab</p>
</div>
<div style="padding:32px;">${body}</div>
<div style="padding:16px 32px;border-top:1px solid #eee;background:#fafaf8;">
<p style="color:#999;font-size:12px;margin:0;">Natural Beauty Lab · Formulation-led skincare, haircare &amp; body care<br>
<a href="${SITE_URL}" style="color:#33523F;">thenaturalbeautylab.com</a></p>
</div></div></body></html>`;
}

// ── Customer order confirmation ─────────────────────────────────────────

export async function sendOrderConfirmationEmail(order: any): Promise<boolean> {
  const resend = getResend();
  if (!resend || !order.delivery_email) return false;

  const items = order.order_items || [];
  const html = emailTemplate(`
    <h2 style="color:#1B2E23;font-size:22px;font-weight:400;margin:0 0 4px;">Thank you for your order</h2>
    <p style="color:#6B7A6E;margin:0 0 20px;">Order <strong style="color:#1B2E23;">${order.order_number}</strong> has been confirmed.</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#22392C;">
      <tr style="border-bottom:2px solid #1B2E23;">
        <th style="padding:8px 0;text-align:left">Product</th>
        <th style="padding:8px 0;text-align:center">Qty</th>
        <th style="padding:8px 0;text-align:right">Price</th>
      </tr>
      ${orderItemsHtml(items)}
    </table>

    <div style="margin:16px 0;font-size:14px;color:#22392C;">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span>Subtotal</span><span>${formatMoney(order.subtotal_cents)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
        <span>Shipping</span><span>${order.shipping_cents ? formatMoney(order.shipping_cents) : "Free"}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-weight:700;font-size:16px;margin-top:8px;padding-top:8px;border-top:2px solid #1B2E23;">
        <span>Total</span><span>${formatMoney(order.total_cents)}</span>
      </div>
    </div>

    <div style="background:#F7F4EC;border-radius:10px;padding:14px 18px;margin:20px 0;font-size:13px;color:#22392C;">
      <p style="margin:0 0 4px;font-weight:600;">Delivery to:</p>
      <p style="margin:0;color:#6B7A6E;">${order.delivery_name}<br>
      ${order.delivery_address || ""}${order.delivery_city ? ", " + order.delivery_city : ""}<br>
      ${order.delivery_country || "United Kingdom"}</p>
    </div>

    <p style="font-size:13px;color:#6B7A6E;margin:16px 0 0;">We'll send you another email when your order ships.</p>
  `);

  try {
    await resend.emails.send({
      from: `Natural Beauty Lab <${FROM_EMAIL}>`,
      to: order.delivery_email,
      subject: `Order confirmed — ${order.order_number}`,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] Customer confirmation failed:", err);
    return false;
  }
}

// ── Business notification ───────────────────────────────────────────────

export async function sendBusinessNotificationEmail(order: any): Promise<boolean> {
  const resend = getResend();
  if (!resend || !BUSINESS_EMAIL) return false;

  const items = order.order_items || [];
  const html = emailTemplate(`
    <h2 style="color:#1B2E23;font-size:22px;font-weight:400;margin:0 0 4px;">New paid order</h2>
    <p style="color:#6B7A6E;margin:0 0 20px;">Order <strong style="color:#1B2E23;">${order.order_number}</strong> · ${formatMoney(order.total_cents)}</p>

    <div style="background:#F7F4EC;border-radius:10px;padding:14px 18px;margin:0 0 16px;font-size:13px;color:#22392C;">
      <p style="margin:0 0 4px;font-weight:600;">Customer:</p>
      <p style="margin:0;">${order.delivery_name} · ${order.delivery_email}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#22392C;">
      <tr style="border-bottom:2px solid #1B2E23;">
        <th style="padding:8px 0;text-align:left">Product</th>
        <th style="padding:8px 0;text-align:center">Qty</th>
        <th style="padding:8px 0;text-align:right">Price</th>
      </tr>
      ${orderItemsHtml(items)}
    </table>

    <p style="font-size:14px;font-weight:700;color:#1B2E23;margin:12px 0;">Total: ${formatMoney(order.total_cents)}</p>

    <div style="background:#F7F4EC;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:13px;color:#22392C;">
      <p style="margin:0 0 4px;font-weight:600;">Ship to:</p>
      <p style="margin:0;color:#6B7A6E;">${order.delivery_name}<br>
      ${order.delivery_address || ""}${order.delivery_city ? ", " + order.delivery_city : ""}<br>
      ${order.delivery_country || "United Kingdom"}</p>
      ${order.delivery_note ? `<p style="margin:8px 0 0;color:#C1922F;">Note: ${order.delivery_note}</p>` : ""}
    </div>

    <a href="${SITE_URL}/admin" style="display:inline-block;background:#33523F;color:#F3F1E7;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">View in Admin</a>
  `);

  try {
    await resend.emails.send({
      from: `Natural Beauty Lab Orders <${FROM_EMAIL}>`,
      to: BUSINESS_EMAIL,
      subject: `New order — ${order.order_number} · ${formatMoney(order.total_cents)}`,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] Business notification failed:", err);
    return false;
  }
}

// ── Shipping notification ───────────────────────────────────────────────

export async function sendShippingNotificationEmail(
  order: any,
  tracking?: { carrier?: string; trackingNumber?: string; trackingUrl?: string }
): Promise<boolean> {
  const resend = getResend();
  if (!resend || !order.delivery_email) return false;

  const trackingHtml = tracking?.trackingNumber
    ? `<div style="background:#F7F4EC;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:13px;color:#22392C;">
        <p style="margin:0 0 4px;font-weight:600;">Tracking:</p>
        ${tracking.carrier ? `<p style="margin:0;">Carrier: ${tracking.carrier}</p>` : ""}
        <p style="margin:0;">Tracking: ${tracking.trackingNumber}</p>
        ${tracking.trackingUrl ? `<p style="margin:4px 0 0;"><a href="${tracking.trackingUrl}" style="color:#33523F;font-weight:600;">Track your package →</a></p>` : ""}
       </div>`
    : "";

  const html = emailTemplate(`
    <h2 style="color:#1B2E23;font-size:22px;font-weight:400;margin:0 0 4px;">Your order has shipped</h2>
    <p style="color:#6B7A6E;margin:0 0 20px;">Order <strong style="color:#1B2E23;">${order.order_number}</strong> is on its way.</p>
    ${trackingHtml}
    <div style="background:#F7F4EC;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:13px;color:#22392C;">
      <p style="margin:0 0 4px;font-weight:600;">Delivery to:</p>
      <p style="margin:0;color:#6B7A6E;">${order.delivery_name}<br>
      ${order.delivery_address || ""}${order.delivery_city ? ", " + order.delivery_city : ""}<br>
      ${order.delivery_country || "United Kingdom"}</p>
    </div>
  `);

  try {
    await resend.emails.send({
      from: `Natural Beauty Lab <${FROM_EMAIL}>`,
      to: order.delivery_email,
      subject: `Your order has shipped — ${order.order_number}`,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] Shipping notification failed:", err);
    return false;
  }
}
