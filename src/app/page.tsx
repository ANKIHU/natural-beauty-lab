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

      <section className="block">
        <div className="wrap">
          <div className="story">
            <div className="inner">
              <div>
                <div className="kicker">THE LAB&apos;S ORIGIN</div>
                <h2>It began in Grandma&apos;s kitchen</h2>
                <p>
                  We learned skincare before we could read — crushed aloe on a scraped knee, honey with
                  lime and ginger for a cold, clay from the riverbank for troubled skin. Years later,
                  science confirmed what Grandma always knew.
                </p>
                <blockquote>
                  &ldquo;My grandmother never read an ingredient label. She simply walked outside, picked what
                  she needed, and trusted the earth to provide.&rdquo;
                  <cite>— The Natural Beauty Lab</cite>
                </blockquote>
              </div>
              <div>
                <div className="kicker">MADE THE FRESH WAY</div>
                <h2 style={{ fontSize: 26 }}>Fresh formulations, honestly labeled</h2>
                <p>
                  Some of our products carry a shelf life of days, not years — made to order, refrigerated,
                  and used fresh like the spa treatments they are. When a product is fresh, potent, or unrated,
                  the label says so plainly. That is the Lab&apos;s promise.
                </p>
                <Link href="/about" className="btn btn-honey" style={{ marginTop: 8 }}>More about the Lab</Link>
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
