"use client";

import Link from "next/link";
import { getActiveProducts, CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { LeafIcon } from "@/components/Icons";

export default function HomePage() {
  const products = getActiveProducts();
  const bestsellers = products.filter((p) => p.badge === "bestseller").concat(products.filter((p) => !p.badge)).slice(0, 4);
  const fresh = products.filter((p) => p.badge === "new").concat([...products].reverse()).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <div className="kicker">FROM A FAMILY KITCHEN TO YOUR SHELF</div>
            <h1>Nature knows what to do. <em>We help it along.</em></h1>
            <p className="lede">
              Twenty-seven small-batch formulations for skin, body and hair — built on raw honey,
              botanicals and three generations of herbalist wisdom, made fresh and never mass-produced.
            </p>
            <div className="cta-row">
              <Link href="/shop" className="btn btn-honey">Shop all products</Link>
              <Link href="/about" className="btn btn-ghost">Read our story</Link>
            </div>
            <div className="hero-note">
              <div><LeafIcon color="#C1922F" /> 100% natural ingredients</div>
              <div><LeafIcon color="#C1922F" /> Small batch, made fresh</div>
              <div><LeafIcon color="#C1922F" /> No sulfates or parabens</div>
            </div>
          </div>
          <div />
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="kicker">FIND YOUR RITUAL</div>
              <h2>Shop by category</h2>
            </div>
          </div>
          <div className="cat-tiles">
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} className="cat-tile">
                <div className="ico"><LeafIcon color="var(--moss)" /></div>
                <b>{c}</b>
                <span>{products.filter((p) => p.category === c).length} products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 6 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="kicker">LOVED MOST</div>
              <h2>Bestsellers</h2>
            </div>
            <Link href="/shop" className="more">View all 27 →</Link>
          </div>
          <div className="grid">
            {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Formulation Philosophy — two-column green panel */}
      <section className="block">
        <div className="wrap">
          <div className="story">
            <div className="inner">
              <div>
                <div className="kicker">FORMULATED WITH PURPOSE</div>
                <h2>Nature, refined by science.</h2>
                <p>
                  We formulate with carefully selected botanical oils, extracts, clays and proven cosmetic
                  ingredients — chosen not because they are fashionable, but because they have a clear purpose
                  in the formula. Every product is designed around what it needs to do, how it feels on the
                  skin or hair, and how its ingredients work together.
                </p>
                <blockquote>
                  &ldquo;Natural is where we begin. Formulation science determines what makes the final product.&rdquo;
                  <cite>— The Natural Beauty Lab</cite>
                </blockquote>
              </div>
              <div>
                <div className="kicker">THE LAB STANDARD</div>
                <h2 style={{ fontSize: 26 }}>Thoughtful formulas. Nothing hidden.</h2>
                <p>
                  Every formula starts with function: cleanse, hydrate, condition, exfoliate or nourish.
                  We consider ingredient compatibility, concentration, texture, stability, packaging and
                  intended use — then tell you clearly what is inside, why it is there and how to use it.
                </p>
                <Link href="/about" className="btn btn-honey" style={{ marginTop: 8 }}>Discover our formulation philosophy</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="kicker">JUST BOTTLED</div>
              <h2>New &amp; noteworthy</h2>
            </div>
            <Link href="/shop" className="more">Shop all →</Link>
          </div>
          <div className="grid">
            {fresh.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
