"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { BrandMark, SearchIcon, BagIcon } from "./Icons";

export function Header() {
  const { cartCount, openCart } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <div className="topline">Handmade in small batches · Free shipping on orders over £60.00</div>
      <header className="site-header">
        <div className="wrap">
          <div className="hbar">
            <Link href="/" className="brand">
              <BrandMark />
              <span>
                <b>Nature&apos;s Beauty Lab</b>
                <span>NATURAL · SMALL BATCH</span>
              </span>
            </Link>
            <form className="searchbox" onSubmit={handleSearch} role="search">
              <input
                type="search"
                placeholder="Search 27 natural formulations..."
                aria-label="Search products"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" aria-label="Search">
                <SearchIcon />
              </button>
            </form>
            <nav className="hnav">
              <Link href="/shop" className="hide-m">Shop</Link>
              <Link href="/about" className="hide-m">Our story</Link>
              <Link href="/admin" className="hide-m">Admin</Link>
              <button className="cartbtn" onClick={openCart}>
                <BagIcon />
                Basket
                {cartCount > 0 && <span className="bubble">{cartCount}</span>}
              </button>
            </nav>
          </div>
          <div className="catstrip">
            <div className="wrap">
              <div className="row">
                <Link href="/shop" className="catstrip-btn">All products</Link>
                {CATEGORIES.map((c) => (
                  <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} className="catstrip-btn">
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
