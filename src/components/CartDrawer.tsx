"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getProductById, money, FREE_SHIPPING_THRESHOLD } from "@/lib/products";
import { CloseIcon, LeafIcon } from "./Icons";
import { ProductArt } from "./ProductArt";
import { CheckoutModal } from "./CheckoutModal";
import { useState } from "react";

export function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, shipping, total, setQty, removeItem } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const toFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      <div className={`scrim ${isOpen ? "open" : ""}`} onClick={closeCart} />
      <aside className={`drawer ${isOpen ? "open" : ""}`} aria-label="Shopping cart">
        <header>
          <h3>Your basket</h3>
          <button className="iconbtn" onClick={closeCart} aria-label="Close cart">
            <CloseIcon />
          </button>
        </header>
        <div className="items">
          {lines.length === 0 ? (
            <div className="empty" style={{ padding: "60px 10px" }}>
              <div className="serif">Your basket is empty</div>
              <p>Every good ritual starts with one jar.</p>
              <Link href="/shop" className="btn btn-moss" onClick={closeCart}>
                Browse the shop
              </Link>
            </div>
          ) : (
            lines.map((l) => {
              const p = getProductById(l.id);
              if (!p) return null;
              return (
                <div key={l.id} className="citem">
                  <Link href={`/product/${p.id}`} className="thumb" onClick={closeCart}>
                    <ProductArt product={p} />
                  </Link>
                  <div>
                    <b>{p.name}</b>
                    <span className="unit">{money(p.price)} · {p.size}</span>
                    <div className="qty" style={{ marginTop: 8 }}>
                      <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease">−</button>
                      <input value={l.qty} readOnly aria-label="Quantity" />
                      <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase">+</button>
                    </div>
                    <button className="rm" onClick={() => removeItem(l.id)}>Remove</button>
                  </div>
                  <div className="lineprice">{money(p.price * l.qty)}</div>
                </div>
              );
            })
          )}
        </div>
        {lines.length > 0 && (
          <footer>
            {toFree > 0 ? (
              <>
                <div className="freenote">{money(toFree)} away from free shipping</div>
                <div className="freebar">
                  <i style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
                </div>
              </>
            ) : (
              <>
                <div className="freenote" style={{ color: "var(--moss)", fontWeight: 700 }}>
                  You&apos;ve unlocked free shipping <LeafIcon color="var(--honey)" />
                </div>
                <div className="freebar"><i style={{ width: "100%" }} /></div>
              </>
            )}
            <div className="totrow"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="totrow"><span>Shipping</span><span>{shipping ? money(shipping) : "Free"}</span></div>
            <div className="totrow grand"><span>Total</span><span>{money(total)}</span></div>
            <button
              className="btn btn-honey"
              style={{ width: "100%" }}
              onClick={() => { closeCart(); setCheckoutOpen(true); }}
            >
              Checkout · {money(total)}
            </button>
          </footer>
        )}
      </aside>
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
