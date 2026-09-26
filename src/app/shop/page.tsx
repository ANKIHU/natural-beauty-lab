"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { getActiveProducts, CATEGORIES } from "@/lib/products";
import { getProductFreeFromEligibility } from "@/lib/allergy-aware";
import { ProductCard } from "@/components/ProductCard";

function ShopContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat") || "";
  const qParam = searchParams.get("q") || "";

  const [cats, setCats] = useState<Set<string>>(catParam ? new Set([catParam]) : new Set());
  const [foci, setFoci] = useState<Set<string>>(new Set());
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState(qParam);
  // Allergy preference filters
  const [fragranceFree, setFragranceFree] = useState(false);
  const [essentialOilFree, setEssentialOilFree] = useState(false);
  const [beeIngredientFree, setBeeIngredientFree] = useState(false);
  const [nutOilFree, setNutOilFree] = useState(false);

  // Sync category filter when URL params change (e.g. category strip tabs)
  useEffect(() => {
    if (catParam) setCats(new Set([catParam]));
    else setCats(new Set());
  }, [catParam]);

  useEffect(() => {
    if (qParam) setQuery(qParam);
  }, [qParam]);

  const allProducts = getActiveProducts();
  const allFoci = useMemo(() => Array.from(new Set(allProducts.map((p) => p.focus))).sort(), [allProducts]);

  const filtered = useMemo(() => {
    let ps = allProducts;
    if (cats.size) ps = ps.filter((p) => cats.has(p.category));
    if (foci.size) ps = ps.filter((p) => foci.has(p.focus));
    if (inStock) ps = ps.filter((p) => p.stock > 0);
    // Allergy preference filters — conservative: only "eligible" passes
    if (fragranceFree) ps = ps.filter((p) => getProductFreeFromEligibility(p).fragranceFree === "eligible");
    if (essentialOilFree) ps = ps.filter((p) => getProductFreeFromEligibility(p).essentialOilFree === "eligible");
    if (beeIngredientFree) ps = ps.filter((p) => getProductFreeFromEligibility(p).beeIngredientFree === "eligible");
    if (nutOilFree) ps = ps.filter((p) => getProductFreeFromEligibility(p).nutOilFree === "eligible");
    if (query) {
      const q = query.toLowerCase();
      ps = ps.filter((p) =>
        `${p.name} ${p.category} ${p.focus} ${p.desc} ${p.ingredients.map((i) => i[0]).join(" ")}`.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc": return [...ps].sort((a, b) => a.price - b.price);
      case "price-desc": return [...ps].sort((a, b) => b.price - a.price);
      case "rating": return [...ps].sort((a, b) => b.rating - a.rating);
      case "name": return [...ps].sort((a, b) => a.name.localeCompare(b.name));
      default: return ps;
    }
  }, [allProducts, cats, foci, inStock, query, sort, fragranceFree, essentialOilFree, beeIngredientFree, nutOilFree]);

  const toggleCat = (c: string) => {
    setCats((prev) => { const n = new Set(prev); n.has(c) ? n.delete(c) : n.add(c); return n; });
  };
  const toggleFocus = (f: string) => {
    setFoci((prev) => { const n = new Set(prev); n.has(f) ? n.delete(f) : n.add(f); return n; });
  };
  const clearAll = () => { setCats(new Set()); setFoci(new Set()); setInStock(false); setQuery(""); setSort("featured"); };

  const title = query ? `Results for "${query}"` : cats.size === 1 ? [...cats][0] : "All products";

  return (
    <div className="wrap">
      <div className="shop-layout">
        <aside className="rail" aria-label="Filters">
          <div className="group">
            <h4>CATEGORY</h4>
            {CATEGORIES.map((c) => (
              <label key={c}>
                <input type="checkbox" checked={cats.has(c)} onChange={() => toggleCat(c)} /> {c}
              </label>
            ))}
          </div>
          <div className="group">
            <h4>SKIN &amp; HAIR FOCUS</h4>
            {allFoci.map((f) => (
              <label key={f}>
                <input type="checkbox" checked={foci.has(f)} onChange={() => toggleFocus(f)} /> {f}
              </label>
            ))}
          </div>
          <div className="group">
            <h4>AVAILABILITY</h4>
            <label>
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> In stock only
            </label>
          </div>
          <div className="group">
            <h4>ALLERGY &amp; PREFERENCE</h4>
            <label>
              <input type="checkbox" checked={fragranceFree} onChange={(e) => setFragranceFree(e.target.checked)} /> No added fragrance
            </label>
            <label>
              <input type="checkbox" checked={essentialOilFree} onChange={(e) => setEssentialOilFree(e.target.checked)} /> Essential-oil-free
            </label>
            <label>
              <input type="checkbox" checked={beeIngredientFree} onChange={(e) => setBeeIngredientFree(e.target.checked)} /> Bee-ingredient-free
            </label>
            <label>
              <input type="checkbox" checked={nutOilFree} onChange={(e) => setNutOilFree(e.target.checked)} /> Nut-oil-free
            </label>
          </div>
        </aside>
        <div>
          <h2 className="serif" style={{ fontSize: 32, marginBottom: 4 }}>{title}</h2>
          <div className="shop-tools">
            <span className="count">
              {filtered.length} of {allProducts.length} products
              {query && (
                <button className="chip" onClick={() => setQuery("")} style={{ marginLeft: 8 }}>
                  &ldquo;{query}&rdquo; ✕
                </button>
              )}
            </span>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "var(--muted)" }}>
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Customer rating</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
          {filtered.length ? (
            <div className="grid">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="empty">
              <div className="serif">Nothing matches those filters</div>
              <p>Try clearing a filter or two — the right formula is in here somewhere.</p>
              <button className="btn btn-moss" onClick={clearAll}>Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: "60px 0" }}><p>Loading...</p></div>}>
      <ShopContent />
    </Suspense>
  );
}
