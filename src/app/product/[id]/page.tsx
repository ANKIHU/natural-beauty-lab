"use client";

import { use, useState } from "react";
import Link from "next/link";
import { getProductById, getActiveProducts, money, FREE_SHIPPING_THRESHOLD, getBundlesForProduct } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { LeafIcon } from "@/components/Icons";

function starHTML(r: number) {
  const full = Math.round(r);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

type TabKey = "story" | "ings" | "howto" | "details";
const TABS: [TabKey, string][] = [
  ["story", "Description"],
  ["ings", "Key ingredients"],
  ["howto", "How to use"],
  ["details", "Details"],
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProductById(id);
  const { addToCart, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>("story");

  if (!product || !product.active) {
    return (
      <div className="wrap">
        <div className="empty">
          <div className="serif">We couldn&apos;t find that product</div>
          <p>It may have been retired from the range.</p>
          <Link href="/shop" className="btn btn-moss">Back to the shop</Link>
        </div>
      </div>
    );
  }

  const related = getActiveProducts()
    .filter((x) => x.id !== product.id && (x.category === product.category || x.focus === product.focus))
    .slice(0, 4);

  const stockLine = product.stock <= 0
    ? <div className="stockline out">Out of stock — back in the next batch</div>
    : product.stock < 8
    ? <div className="stockline low">Low stock — only {product.stock} left in this batch</div>
    : <div className="stockline ok">In stock — ships in 1–2 days</div>;

  const tabContent = () => {
    switch (tab) {
      case "ings":
        return (
          <ul className="ing-list">
            {product.ingredients.map(([name, desc], i) => (
              <li key={i}>
                <span className="ing-dot"><LeafIcon color="var(--moss)" /></span>
                <span><b>{name}</b><span>{desc}</span></span>
              </li>
            ))}
          </ul>
        );
      case "howto":
        return (
          <>
            <p>{product.howto}</p>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              New to an ingredient? Patch-test on the inner arm and wait 24 hours before first full use.
            </p>
          </>
        );
      case "details":
        return (
          <table className="spec">
            <tbody>
              <tr><td>Size</td><td>{product.size}</td></tr>
              <tr><td>Best for</td><td>{product.focus}</td></tr>
              <tr><td>Category</td><td>{product.category}</td></tr>
              <tr><td>Shelf life &amp; care</td><td>{product.shelf}</td></tr>
              <tr><td>Made</td><td>Small-batch by hand · The Natural Beauty Lab</td></tr>
              <tr><td>Free from</td><td>Sulfates, parabens, synthetic fragrance, animal testing</td></tr>
            </tbody>
          </table>
        );
      default:
        return (
          <>
            <p>{product.desc}</p>
            <p>{product.pitch}</p>
          </>
        );
    }
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> /{" "}
        <Link href={`/shop?cat=${encodeURIComponent(product.category)}`}>{product.category}</Link> /{" "}
        {product.name}
      </nav>
      <div className="pdp">
        <div className="pdp-art">
          <ProductArt product={product} big />
        </div>
        <div className="pdp-info">
          <div className="kicker">{product.category.toUpperCase()} · {product.focus.toUpperCase()}</div>
          <h1>{product.name}</h1>
          <div className="sub">
            <span className="stars">{starHTML(product.rating)} <small>{product.reviews} customer reviews</small></span>
          </div>
          <p style={{ maxWidth: "56ch" }}>{product.desc}</p>
          <div className="pdp-price">{money(product.price)} <small>· {product.size}</small></div>
          {stockLine}
          <div className="buybox">
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>QUANTITY</label>
            <br />
            <span className="qty" style={{ marginTop: 8 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
              <input value={qty} readOnly aria-label="Quantity" />
              <button onClick={() => setQty(Math.min(99, qty + 1))} aria-label="Increase quantity">+</button>
            </span>
            <div className="buy-actions">
              <button
                className="btn btn-moss"
                disabled={product.stock <= 0}
                onClick={() => { addToCart(product.id, qty); openCart(); }}
              >
                Add to basket
              </button>
              <button
                className="btn btn-honey"
                disabled={product.stock <= 0}
                onClick={() => { addToCart(product.id, qty); openCart(); }}
              >
                Buy now
              </button>
            </div>
            <div className="trust">
              <div><LeafIcon /> Made in small batches</div>
              <div><LeafIcon /> Free shipping over £{FREE_SHIPPING_THRESHOLD.toFixed(2)}</div>
              <div><LeafIcon /> 30-day happiness guarantee</div>
              <div><LeafIcon /> Cruelty-free, always</div>
            </div>
          </div>
          <div className="tabs" role="tablist">
            {TABS.map(([key, label]) => (
              <button key={key} role="tab" className={tab === key ? "on" : ""} onClick={() => setTab(key)}>
                {label}
              </button>
            ))}
          </div>
          <div className="tabpanel">{tabContent()}</div>
        </div>
      </div>
      {/* Bundles containing this product */}
      {getBundlesForProduct(product.id).length > 0 && (
        <section className="block" style={{ paddingTop: 8 }}>
          <div className="sec-head">
            <div>
              <div className="kicker">SAVE WITH A BUNDLE</div>
              <h2>Better together</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {getBundlesForProduct(product.id).map((bundle) => {
              const saving = bundle.individualValue - bundle.price;
              return (
                <div key={bundle.id} style={{
                  background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)",
                  padding: "20px", display: "flex", flexDirection: "column", gap: 10,
                }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600 }}>{bundle.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{bundle.description}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 700 }}>{money(bundle.price)}</span>
                    <span style={{ fontSize: 13, color: "var(--muted)", textDecoration: "line-through" }}>{money(bundle.individualValue)}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#22C55E", background: "rgba(34,197,94,0.08)", padding: "2px 7px", borderRadius: 999 }}>
                      Save {money(saving)}
                    </span>
                  </div>
                  <Link href="/collections/mens-grooming" className="btn btn-moss" style={{ width: "100%", textAlign: "center", marginTop: "auto" }}>
                    View bundle
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section className="block" style={{ paddingTop: 8 }}>
          <div className="sec-head">
            <div>
              <div className="kicker">PAIRS WELL WITH</div>
              <h2>You may also like</h2>
            </div>
          </div>
          <div className="grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
