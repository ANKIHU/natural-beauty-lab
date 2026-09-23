"use client";

import Link from "next/link";
import Image from "next/image";
import { getActiveProducts, BUNDLES, money, type Bundle } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart-context";
import { LeafIcon } from "@/components/Icons";

function BundleCard({ bundle }: { bundle: Bundle }) {
  const { addToCart, openCart } = useCart();
  const saving = bundle.individualValue - bundle.price;
  const products = getActiveProducts().filter((p) => bundle.productIds.includes(p.id));

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)",
      padding: "24px", display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{bundle.name}</h3>
        <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>{bundle.description}</p>
      </div>

      {/* Product thumbnails */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", border: "1px solid var(--line)", flexShrink: 0 }}>
            {p.image ? (
              <Image src={p.image} alt={p.name} width={56} height={56} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            ) : (
              <div style={{ width: 56, height: 56, background: "var(--sage-soft)" }} />
            )}
          </Link>
        ))}
      </div>

      {/* Pricing */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>{money(bundle.price)}</span>
        <span style={{ fontSize: 14, color: "var(--muted)", textDecoration: "line-through" }}>{money(bundle.individualValue)}</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#22C55E", background: "rgba(34,197,94,0.08)", padding: "2px 8px", borderRadius: 999 }}>
          Save {money(saving)}
        </span>
      </div>

      <button
        onClick={() => {
          bundle.productIds.forEach((id) => addToCart(id, 1));
          openCart();
        }}
        className="btn btn-moss"
        style={{ width: "100%", marginTop: "auto" }}
      >
        Add bundle to basket
      </button>
    </div>
  );
}

export default function MensGroomingCollectionPage() {
  const products = getActiveProducts().filter((p) => p.category === "Men's Grooming");

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: "var(--deep)", color: "#F1EEE0", padding: "clamp(44px, 6vw, 68px) 0",
      }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 36, alignItems: "center" }}>
          <div>
            <div className="kicker" style={{ color: "var(--honey)" }}>MEN&apos;S GROOMING</div>
            <h1 style={{ fontSize: "clamp(34px, 4.5vw, 52px)", fontWeight: 600, color: "#F6F2E3", lineHeight: 1.08, marginBottom: 16 }}>
              Formulated for purpose.<br />Designed for men.
            </h1>
            <p style={{ fontSize: 16, color: "#CFD6C4", lineHeight: 1.7, maxWidth: "50ch", marginBottom: 20 }}>
              Ten grooming essentials built with botanical oils, extracts and modern cosmetic ingredients.
              Every formula starts with what it needs to do — cleanse, condition, protect or refresh —
              and uses ingredients selected for that purpose.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#B9C3AB" }}>
                <LeafIcon color="var(--honey)" size={14} /> Botanical ingredients
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#B9C3AB" }}>
                <LeafIcon color="var(--honey)" size={14} /> Small batch
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#B9C3AB" }}>
                <LeafIcon color="var(--honey)" size={14} /> Honest labels
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 360 }}>
            {products.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "1", border: "1px solid rgba(255,255,255,0.08)" }}>
                {p.image && (
                  <Image src={p.image} alt={p.name} width={180} height={180} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="kicker">SAVE WITH BUNDLES</div>
              <h2>Curated sets</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
            {BUNDLES.map((b) => <BundleCard key={b.id} bundle={b} />)}
          </div>
        </div>
      </section>

      {/* All products */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="kicker">THE FULL RANGE</div>
              <h2>All men&apos;s grooming products</h2>
            </div>
            <span style={{ fontSize: 14.5, color: "var(--muted)" }}>{products.length} products</span>
          </div>
          <div className="grid">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Formulation note */}
      <section style={{ padding: "40px 0 60px" }}>
        <div className="wrap" style={{ maxWidth: "64ch", textAlign: "center" }}>
          <p style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.7 }}>
            All men&apos;s grooming formulations use approved cosmetic claim language. Ingredient lists
            are development formulations — final packaging declarations will use compliant INCI nomenclature.
            Products are not described as organic unless certification has been confirmed.
          </p>
        </div>
      </section>
    </div>
  );
}
