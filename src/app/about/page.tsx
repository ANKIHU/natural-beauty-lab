import Link from "next/link";
import { LeafIcon } from "@/components/Icons";

// Ingredient categories derived from actual product formulation data
const INGREDIENT_CATEGORIES = [
  { name: "Botanical Oils", examples: "Jojoba, argan, rosehip seed, sweet almond, coconut, grapeseed, sea buckthorn", role: "Carrier oils and essential oils selected for skin compatibility, absorption profile and functional properties within each formula." },
  { name: "Humectants", examples: "Raw honey, aloe vera, vegetable glycerin", role: "Ingredients that attract and hold moisture in the skin or hair. Concentration and formulation context determine their effectiveness." },
  { name: "Butters", examples: "Shea butter, cocoa butter, beeswax", role: "Rich lipids that provide occlusion, texture and lasting moisture. Used where heavier barrier function is part of the formula design." },
  { name: "Clays &amp; Minerals", examples: "Bentonite clay, kaolin clay, activated charcoal, zinc oxide", role: "Absorbent minerals used in masks, powders and protective formulations. Selected for particle size, absorption capacity and intended use." },
  { name: "Botanical Extracts", examples: "Turmeric, papaya enzyme, cucumber, green tea, witch hazel, chamomile", role: "Plant-derived extracts chosen for their established cosmetic properties — soothing, conditioning, mild exfoliation or antioxidant support." },
  { name: "Functional Ingredients", examples: "Plant emulsifying wax, castile soap base, calcium carbonate, magnesium chloride", role: "Ingredients that serve a structural or functional role in the formula — emulsification, cleansing, gentle abrasion or mineral delivery." },
];

const LAB_METHOD_STEPS = [
  { num: "01", title: "Purpose", desc: "Define what the formulation is intended to do." },
  { num: "02", title: "Select", desc: "Choose ingredients for their function within the formula." },
  { num: "03", title: "Formulate", desc: "Balance ingredients, texture, concentration and compatibility." },
  { num: "04", title: "Evaluate", desc: "Assess appearance, feel, stability and intended use." },
  { num: "05", title: "Package", desc: "Choose packaging appropriate to the formulation." },
  { num: "06", title: "Explain", desc: "Tell the customer what is inside and how to use it." },
];

const LAB_STANDARD = [
  "Purposeful formulation",
  "Clear ingredient information",
  "Product-specific directions",
  "Thoughtful packaging",
  "Small-batch production",
  "Responsible claims",
];

export default function AboutPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* ── 01 HERO ── */}
      <section style={{ padding: "clamp(44px, 6vw, 72px) 0 clamp(36px, 5vw, 56px)" }}>
        <div className="wrap" style={{ maxWidth: "74ch" }}>
          <div className="kicker">OUR STORY</div>
          <h1 style={{ fontSize: "clamp(32px, 4.5vw, 54px)", lineHeight: 1.08, marginBottom: 20 }}>
            Formulation-led.<br />Rooted in nature.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 14 }}>
            Natural Beauty Lab starts with a simple principle: nature provides extraordinary ingredients,
            and formulation science helps us use them intelligently.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 14 }}>
            We combine carefully selected botanical oils, extracts, clays and modern cosmetic ingredients
            to create skincare, haircare and body care designed around a clear purpose, a considered
            formulation and an enjoyable experience.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 0 }}>
            Every formula begins with function — cleanse, hydrate, condition, exfoliate, nourish or protect.
            Ingredients are selected for the role they perform, how they work together and how they affect
            the finished product&apos;s texture, stability and use.
          </p>
          <blockquote style={{
            margin: "30px 0", paddingLeft: 20, borderLeft: "3px solid var(--honey)",
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 23, lineHeight: 1.4,
          }}>
            &ldquo;Nature gives us the ingredients.<br />
            Formulation science brings them together.&rdquo;
            <cite style={{ display: "block", fontFamily: "'Karla'", fontStyle: "normal", fontSize: 13, color: "var(--muted)", marginTop: 8 }}>
              — The Natural Beauty Lab
            </cite>
          </blockquote>
        </div>
      </section>

      {/* ── 02 PRINCIPLES ── */}
      <section style={{ background: "var(--card)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "clamp(36px, 5vw, 56px) 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { num: "01", title: "Nature + Science", desc: "Botanical ingredients selected for a purpose and developed with formulation science." },
              { num: "02", title: "Small Batch", desc: "Produced in considered batches with attention to consistency, freshness and quality." },
              { num: "03", title: "Honest Labels", desc: "Clear ingredients. Clear directions. No need to hide behind vague marketing language." },
              { num: "04", title: "Thoughtful Formulation", desc: "Every ingredient should have a reason for being in the formula." },
            ].map((p) => (
              <div key={p.num} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "var(--honey)", lineHeight: 1 }}>{p.num}</span>
                  <LeafIcon color="var(--sage)" size={14} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{p.title}</h3>
                <p style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 THE LAB METHOD ── */}
      <section style={{ padding: "clamp(44px, 6vw, 68px) 0" }}>
        <div className="wrap" style={{ maxWidth: "74ch" }}>
          <div className="kicker">THE LAB METHOD</div>
          <h2 style={{ fontSize: "clamp(26px, 3.4vw, 38px)", marginBottom: 12 }}>Every ingredient has a job.</h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", marginBottom: 6 }}>
            A formula is more than a list of natural ingredients. Performance depends on concentration,
            compatibility, processing, preservation, packaging and how the finished product will actually be used.
          </p>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", marginBottom: 32 }}>
            At Natural Beauty Lab, formulation begins by defining what the product needs to do.
            Ingredients are then selected to perform specific functions within that system.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
            {LAB_METHOD_STEPS.map((s) => (
              <div key={s.num} style={{
                background: "var(--card)", border: "1px solid var(--line)", borderRadius: "var(--r-md)",
                padding: "18px 16px", display: "flex", flexDirection: "column", gap: 6,
              }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "var(--honey)", lineHeight: 1 }}>{s.num}</span>
                <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{s.title}</h4>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 INGREDIENT INTELLIGENCE ── */}
      <section style={{ background: "var(--deep)", color: "#F1EEE0", padding: "clamp(44px, 6vw, 68px) 0" }}>
        <div className="wrap">
          <div style={{ maxWidth: "74ch", marginBottom: 28 }}>
            <div className="kicker" style={{ color: "var(--honey)" }}>INGREDIENT INTELLIGENCE</div>
            <h2 style={{ fontSize: "clamp(26px, 3.4vw, 38px)", color: "#F6F2E3", marginBottom: 12 }}>
              Know what you&apos;re putting on your skin.
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#CFD6C4" }}>
              Ingredient transparency should not stop at printing a list on the back of the package.
              We want customers to understand what an ingredient is and why it appears in a formula.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {INGREDIENT_CATEGORIES.map((cat) => (
              <div key={cat.name} style={{
                background: "rgba(255,255,255,0.06)", borderRadius: "var(--r-md)",
                padding: "18px 20px", border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <LeafIcon color="var(--honey)" size={14} />
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#F6F2E3", margin: 0 }} dangerouslySetInnerHTML={{ __html: cat.name }} />
                </div>
                <p style={{ fontSize: 13, color: "#B9C3AB", lineHeight: 1.5, margin: "0 0 6px", fontStyle: "italic" }}>{cat.examples}</p>
                <p style={{ fontSize: 13.5, color: "#CFD6C4", lineHeight: 1.55, margin: 0 }}>{cat.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 PRESERVATION EDUCATION ── */}
      <section style={{ padding: "clamp(40px, 5vw, 60px) 0" }}>
        <div className="wrap" style={{ maxWidth: "74ch" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", marginBottom: 12 }}>Fresh doesn&apos;t mean careless.</h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", marginBottom: 14 }}>
            Different formulations have different stability and preservation requirements. An oil-based
            balm behaves differently from a water-based lotion, cleanser or gel.
          </p>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)" }}>
            Where a formulation requires an appropriate preservation system, that requirement is part of
            responsible formulation — not something to hide. Storage and use instructions are specific
            to each individual product.
          </p>
        </div>
      </section>

      {/* ── 06 PRODUCT TRANSPARENCY ── */}
      <section style={{ background: "var(--card)", borderTop: "1px solid var(--line)", padding: "clamp(40px, 5vw, 60px) 0" }}>
        <div className="wrap" style={{ maxWidth: "74ch" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", marginBottom: 12 }}>Nothing important hidden.</h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", marginBottom: 20 }}>
            Every product page clearly provides the information you need to make an informed decision.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {["Ingredients", "How to use", "Product size", "Skin / hair / body focus", "Storage guidance", "Shelf-life guidance", "Packaging", "Formulation category"].map((item) => (
              <div key={item} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                background: "var(--paper)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)",
              }}>
                <LeafIcon color="var(--moss)" size={12} />
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 BEYOND THE BOTTLE ── */}
      <section style={{ padding: "clamp(40px, 5vw, 60px) 0" }}>
        <div className="wrap" style={{ maxWidth: "74ch" }}>
          <div className="kicker">BEYOND THE BOTTLE</div>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", marginBottom: 12 }}>Learn the formula, not just the product.</h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", marginBottom: 14 }}>
            Natural Beauty Lab is built around the idea that beauty products become more meaningful when
            you understand how they are made.
          </p>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)" }}>
            Our formulation library explores ingredients, methods, ratios, packaging and the thinking
            behind the products — turning the Lab into a place to learn as well as shop.
          </p>
        </div>
      </section>

      {/* ── 08 THE LAB STANDARD ── */}
      <section style={{
        background: "var(--moss)", color: "#EFEDDF", borderRadius: 26, margin: "0 22px",
        padding: "clamp(36px, 5vw, 52px) clamp(24px, 4vw, 48px)",
      }}>
        <div style={{ maxWidth: "74ch", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", color: "#F6F2E3", marginBottom: 20 }}>The Lab Standard</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {LAB_STANDARD.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <LeafIcon color="var(--honey)" size={14} />
                <span style={{ fontSize: 15, fontWeight: 500, color: "#F2EDD9" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 09 CTA ── */}
      <section style={{ padding: "clamp(40px, 5vw, 60px) 0", textAlign: "center" }}>
        <div className="wrap">
          <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", marginBottom: 8 }}>Explore the collection.</h2>
          <p style={{ fontSize: 15.5, color: "var(--muted)", marginBottom: 20 }}>
            Every product page includes full ingredients, directions, formulation category and storage guidance.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/shop" className="btn btn-honey">Explore products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
