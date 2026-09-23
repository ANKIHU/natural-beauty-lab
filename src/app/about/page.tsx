import Link from "next/link";
import Image from "next/image";
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

      {/* ── 01 HERO (green background, two-column) ── */}
      <section className="hero" style={{ minHeight: "auto", paddingTop: "clamp(44px, 6vw, 72px)", paddingBottom: "clamp(44px, 6vw, 72px)" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 36, alignItems: "center" }}>
          <div>
            <div className="kicker" style={{ color: "var(--honey)" }}>OUR STORY</div>
            <h1 style={{ fontSize: "clamp(32px, 4.5vw, 50px)", lineHeight: 1.08, marginBottom: 20, color: "#F6F2E3" }}>
              Formulation-led.<br />Rooted in nature.
            </h1>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, marginBottom: 14, color: "#CFD6C4" }}>
              Natural Beauty Lab was born from a simple belief: nature provides extraordinary ingredients,
              and science helps us unlock their full potential. We combine time-honoured botanicals with
              modern formulation science to create skincare, haircare, body care and wellness products
              that are effective, safe and a joy to use.
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, marginBottom: 20, color: "#CFD6C4" }}>
              Every formula is developed with a clear purpose — to cleanse, nourish, condition, protect
              or restore — using carefully selected ingredients, balanced at the right concentrations
              and crafted in small batches.
            </p>
            <blockquote style={{
              margin: "0 0 24px", paddingLeft: 18, borderLeft: "3px solid var(--honey)",
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 21, lineHeight: 1.4,
              color: "#F2EDD9",
            }}>
              &ldquo;Nature gives us the ingredients.<br />
              Formulation science brings them to life.&rdquo;
              <cite style={{ display: "block", fontFamily: "'Karla'", fontStyle: "normal", fontSize: 13, color: "#B9C3AB", marginTop: 8 }}>
                — The Natural Beauty Lab
              </cite>
            </blockquote>
            <Link href="/shop" className="btn btn-honey">Discover our story</Link>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 18, overflow: "hidden", position: "relative" }}>
              <Image
                src="/brand/our-story/hero-botanical.jpg"
                alt="Botanical oils, jojoba, lavender and glass vessels — the ingredients of formulation science"
                width={560}
                height={420}
                style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                priority
              />
            </div>
            {/* Floating labels over image */}
            <div style={{
              position: "absolute", top: 20, right: 20,
              background: "rgba(27,46,35,0.85)", backdropFilter: "blur(8px)",
              borderRadius: 12, padding: "16px 20px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <p style={{ fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, color: "var(--honey)", marginBottom: 6, lineHeight: 1.4 }}>NATURAL INGREDIENTS</p>
              <p style={{ fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, color: "rgba(255,255,255,0.45)", marginBottom: 4, lineHeight: 1.4 }}>THOUGHTFUL FORMULATIONS</p>
              <p style={{ fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, color: "rgba(255,255,255,0.45)", marginBottom: 10, lineHeight: 1.4 }}>REAL RESULTS</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["SKIN", "HAIR", "BODY", "WELLNESS"].map((cat) => (
                  <span key={cat} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "#F6F2E3", padding: "3px 8px", background: "rgba(255,255,255,0.1)", borderRadius: 999 }}>{cat}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 PRINCIPLES ── */}
      <section style={{ background: "var(--card)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "clamp(36px, 5vw, 56px) 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { num: "01", title: "Nature + Science", desc: "Botanical ingredients backed by formulation science." },
              { num: "02", title: "Small Batch", desc: "Freshly made in small batches with care and precision." },
              { num: "03", title: "Honest Labels", desc: "Clear ingredients. No hidden extras. No unnecessary additives." },
              { num: "04", title: "Kinder Choices", desc: "Cruelty-free, mindful sourcing and a more sustainable tomorrow." },
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

      {/* ── MISSION SECTION ── */}
      <section style={{ padding: "clamp(44px, 6vw, 68px) 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 36, alignItems: "center" }}>
            {/* Left — editorial image with overlay text */}
            <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", position: "relative", minHeight: 280 }}>
              <Image
                src="/brand/our-story/mission-botanical.jpg"
                alt="Green botanical serum with leaves and natural ingredients"
                width={480}
                height={360}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(transparent, rgba(27,46,35,0.85))",
                padding: "60px 24px 24px",
              }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 500, fontStyle: "italic", lineHeight: 1.3, margin: 0, color: "#F2EDD9" }}>
                  Better ingredients.<br />A more natural you.
                </p>
              </div>
            </div>
            {/* Right — mission copy */}
            <div>
              <div className="kicker">OUR MISSION</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", marginBottom: 14 }}>
                Effective, honest, and accessible natural care.
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--muted)", marginBottom: 24 }}>
                We make high-quality, naturally inspired formulations that fit into real life — for people
                who care about what they put on their skin, hair and body. From daily essentials to targeted
                treatments, every product is designed to help you look good, feel good and care for the
                world we share.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "var(--ink)", margin: "0 0 2px" }}>27</p>
                  <p style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--muted)", margin: 0, lineHeight: 1.3 }}>FORMULATIONS<br />AND GROWING</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "var(--ink)", margin: "0 0 2px" }}>1</p>
                  <p style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--muted)", margin: 0, lineHeight: 1.3 }}>CLEAR<br />PURPOSE</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "var(--ink)", margin: "0 0 2px" }}>∞</p>
                  <p style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--muted)", margin: 0, lineHeight: 1.3 }}>A MORE NATURAL<br />TOMORROW</p>
                </div>
              </div>
            </div>
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
