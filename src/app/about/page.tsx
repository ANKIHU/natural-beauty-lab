import Link from "next/link";
import { money, FREE_SHIPPING_THRESHOLD } from "@/lib/products";

export default function AboutPage() {
  return (
    <div className="wrap">
      <div style={{ maxWidth: "74ch", padding: "44px 0 30px" }}>
        <div className="kicker">OUR STORY</div>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 50px)" }}>From a family kitchen to your shelf</h1>
        <p style={{ fontSize: 17, marginTop: 18 }}>
          Long before we understood the chemistry of skincare, we understood the magic of our grandmother&apos;s
          kitchen. Grandma was the woman to see when your skin was troubled — a naturalist, an herbalist, a healer.
          Shelves of brown glass bottles, golden honey catching the light on the windowsill, clay by the sink,
          and bunches of herbs drying in the rafters.
        </p>
        <p>
          A scraped knee meant freshly crushed aloe wrapped in a clean cloth. Years later, studying formally,
          we discovered that Grandma&apos;s wisdom wasn&apos;t folklore — it was chemistry. The clay dermatologists
          prize. The honey that is a proven humectant and antibacterial. The aloe whose glycoproteins genuinely
          heal skin.
        </p>
        <blockquote style={{
          margin: "26px 0", paddingLeft: 20, borderLeft: "3px solid var(--honey)",
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 24, lineHeight: 1.4,
        }}>
          &ldquo;Watch close, child. The tree knows what to do. You just have to help it along.&rdquo;
        </blockquote>
        <p>
          Every one of our 27 formulations honours that lesson: traditional botanical ingredients, held to the
          standards of modern science, made by hand in small batches. Some are shelf-stable for a year; some are
          fresh formulations made to be used within days — and our labels always tell you which, plainly.
        </p>
        <h2 style={{ margin: "34px 0 12px" }}>The Lab&apos;s promises</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li><b>Small batch, always</b> — nothing sits in a warehouse for years.</li>
          <li><b>Honest labels</b> — shelf life, freshness and limits stated plainly (our zinc butter is not a rated SPF product, and we say so).</li>
          <li><b>Nothing harsh</b> — no sulfates, parabens or synthetic fragrance; never tested on animals.</li>
          <li><b>Shipping</b> — orders ship in 1–2 days; free over {money(FREE_SHIPPING_THRESHOLD)}. 30-day happiness guarantee on everything.</li>
        </ul>
        <Link href="/shop" className="btn btn-honey" style={{ marginTop: 14 }}>Shop the collection</Link>
      </div>
    </div>
  );
}
