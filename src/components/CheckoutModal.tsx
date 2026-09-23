"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { money, getProductById } from "@/lib/products";
import { adminStore } from "@/lib/admin-store";
import { CloseIcon, CheckIcon } from "./Icons";

export function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { lines, cartCount, subtotal, shipping, total, clearCart } = useCart();
  const { toast } = useToast();
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<{ number: string; name: string; email: string } | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handlePlace = async () => {
    if (!name.trim() || !email.trim() || !address.trim() || !city.trim() || !country.trim()) {
      toast("Please fill in all delivery details");
      return;
    }

    setPlacing(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: name.trim(), email: email.trim(), address: address.trim(), city: city.trim(), country: country.trim(), note: note.trim() },
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
        }),
      });

      const data = await res.json();

      // If Stripe returned a checkout URL, redirect to it
      if (data.stripeUrl) {
        window.location.href = data.stripeUrl;
        return;
      }

      // Fallback: no Stripe — record order locally
      const orderNumber = data.orderNumber || "NBL-" + Date.now().toString(36).toUpperCase().slice(-6);

      adminStore.addOrder({
        id: orderNumber,
        number: orderNumber,
        createdAt: Date.now(),
        status: "processing",
        customer: { name: name.trim(), email: email.trim(), address: address.trim(), city: city.trim(), country: country.trim(), note: note.trim() },
        items: lines.map((l) => { const p = getProductById(l.id); return { id: l.id, name: p?.name || "Product", price: p?.price || 0, qty: l.qty }; }),
        subtotal,
        shipping,
        total,
      });
      setOrder({ number: orderNumber, name: name.trim(), email: email.trim() });
      clearCart();
    } catch {
      const orderNumber = "NBL-" + Date.now().toString(36).toUpperCase().slice(-6);
      adminStore.addOrder({
        id: orderNumber,
        number: orderNumber,
        createdAt: Date.now(),
        status: "processing",
        customer: { name: name.trim(), email: email.trim(), address: address.trim(), city: city.trim(), country: country.trim(), note: note.trim() },
        items: lines.map((l) => { const p = getProductById(l.id); return { id: l.id, name: p?.name || "Product", price: p?.price || 0, qty: l.qty }; }),
        subtotal,
        shipping,
        total,
      });
      setOrder({ number: orderNumber, name: name.trim(), email: email.trim() });
      clearCart();
    }

    setPlacing(false);
  };

  const handleClose = () => {
    setOrder(null);
    setName(""); setEmail(""); setAddress(""); setCity(""); setCountry("United Kingdom"); setNote("");
    onClose();
  };

  return (
    <div className="modal-scrim open" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal">
        {order ? (
          <div className="orderok">
            <div className="ring"><CheckIcon /></div>
            <h3>Thank you, {order.name.split(" ")[0]}</h3>
            <p>
              Your order <span className="ordernum">{order.number}</span> is in.
              <br />A confirmation is on its way to {order.email}.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
              <button className="btn btn-line" onClick={handleClose}>Keep shopping</button>
            </div>
          </div>
        ) : (
          <>
            <button className="iconbtn x" onClick={handleClose} aria-label="Close">
              <CloseIcon />
            </button>
            <h3>Checkout</h3>
            <p style={{ color: "var(--muted)", margin: 0 }}>
              {cartCount} item{cartCount === 1 ? "" : "s"} · Total{" "}
              <b style={{ color: "var(--ink)" }}>{money(total)}</b>
              {!shipping && " · free shipping"}
            </p>
            <div className="f-grid">
              <div className="field">
                <label htmlFor="cName">FULL NAME</label>
                <input id="cName" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="cEmail">EMAIL</label>
                <input id="cEmail" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="field full">
                <label htmlFor="cAddr">DELIVERY ADDRESS</label>
                <input id="cAddr" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="cCity">CITY / PARISH</label>
                <input id="cCity" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="cCountry">COUNTRY</label>
                <input id="cCountry" value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>
              <div className="field full">
                <label htmlFor="cNote">ORDER NOTE (OPTIONAL)</label>
                <input id="cNote" placeholder="Gift wrap, delivery instructions..." value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            </div>
            <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: "14px 0 10px" }}>
              Payment is collected on delivery or by invoice while our card gateway is being connected.
            </p>
            <button className="btn btn-honey" style={{ width: "100%" }} onClick={handlePlace} disabled={placing}>
              {placing ? "Placing your order..." : `Place order · ${money(total)}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
