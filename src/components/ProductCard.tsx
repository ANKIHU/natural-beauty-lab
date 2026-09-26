"use client";

import Link from "next/link";
import { type Product, money } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { ProductArt } from "./ProductArt";
import { AllergyAwareBadges } from "./AllergyAware";

function starHTML(r: number) {
  const full = Math.round(r);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, openCart } = useCart();

  return (
    <Link href={`/product/${product.id}`} className="pcard group">
      {product.badge && (
        <span className={`badge ${product.badge}`}>
          {product.badge === "bestseller" ? "Bestseller" : "New"}
        </span>
      )}
      {product.stock <= 0 && <span className="oos">Out of stock</span>}
      {product.stock > 0 && product.stock < 8 && !product.badge && (
        <span className="badge low" style={{ left: "auto", right: 12 }}>Only {product.stock} left</span>
      )}
      <span className="art">
        <ProductArt product={product} />
      </span>
      <span className="body">
        <h3>{product.name}</h3>
        <span className="focus">{product.focus} · {product.size}</span>
        <AllergyAwareBadges product={product} />
        <span className="stars">
          {starHTML(product.rating)} <small>{product.reviews}</small>
        </span>
        <span className="pricerow">
          <span className="price">{money(product.price)}</span>
          <button
            className="mini-add"
            disabled={product.stock <= 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product.id, 1);
              openCart();
            }}
            aria-label={`Add ${product.name} to basket`}
          >
            +
          </button>
        </span>
      </span>
    </Link>
  );
}
