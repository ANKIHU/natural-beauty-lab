# Claims Audit — Natural Beauty Lab

Flagged claims in product data (`src/lib/products.ts`) that may require
review before customer-facing use. These are formulation/educational
statements that could drift toward therapeutic or drug claims depending
on regulatory context (FDA, EU Cosmetics Regulation).

## Flagged Statements

### 1. "antibacterial" (p20 — Natural Whitening Toothpaste)
- Location: `products.ts` line ~174
- Current: "antibacterial plant oils clean teeth"
- Risk: "Antibacterial" can imply drug-level claims depending on context
- Recommendation: Review — if used as cosmetic claim ("helps keep mouth fresh"), may be acceptable. If implying treatment of bacterial infection, needs substantiation.

### 2. "absorbed through the skin" (p16 — Magnesium Body Lotion)
- Location: `products.ts` line ~151
- Current: "Magnesium absorbed through the skin"
- Risk: Transdermal absorption claims can imply drug delivery
- Recommendation: Consider rewording to "applied to the skin" or "massaged into the skin"

### 3. "preservative-free" (p22 — Deep Hydration Conditioner)
- Location: `products.ts` line ~186
- Current: "A fresh, preservative-free treatment"
- Risk: Romanticising lack of preservation. Water-containing products need microbiological control.
- Recommendation: Ensure shelf-life guidance is prominent. Consider adding preservation context.

### 4. "potent" (p23 — Anti-Aging Serum, p26 — Acne Treatment Oil)
- Location: `products.ts` lines ~192, ~210
- Current: "most potent natural anti-aging ingredients", "potent where you need it"
- Risk: "Potent" can drift toward efficacy/therapeutic positioning
- Recommendation: Replace with "concentrated" or "targeted"

### 5. "detox" in product name (p07 — Activated Charcoal Detox Mask)
- Location: Product name + image filename
- Risk: "Detox" implies physiological detoxification which is a therapeutic claim
- Recommendation: Consider "Activated Charcoal Deep Cleansing Mask" or similar cosmetic language

### 6. "Anti-Aging" in product names (p09, p23)
- Location: Product names
- Risk: "Anti-aging" is widely used in cosmetics and generally accepted as cosmetic claim when referring to appearance. FDA has historically treated "reduces the appearance of wrinkles" as cosmetic.
- Recommendation: Acceptable as cosmetic claim if not implying structural skin change

### 7. "heals skin" — REMOVED from about page
- Was in old about page copy
- Status: Removed in this update

### 8. "antibacterial" — REMOVED from about page
- Was in old about page copy referencing honey
- Status: Removed in this update

## Acceptable Cosmetic Claims (retained)
- Cleanses, moisturises, conditions, softens
- Improves the appearance of
- Helps skin feel smoother
- Hydrates, nourishes
- Gentle, soothing
- Refreshing, cooling

## Requires Owner Decision
- Whether to rename "Detox Mask" → "Deep Cleansing Mask"
- Whether to replace "potent" throughout product descriptions
- Whether to add preservation context to preservative-free products
- Whether "antibacterial" in toothpaste context is acceptable for target markets

## Brand Name Inconsistencies Found

| Variant | Location |
|---|---|
| Nature's Beauty Lab | `src/components/Header.tsx` (brand display name) |
| Nature's Beauty Lab | `src/components/Footer.tsx` (footer brand + copyright) |
| Nature's Beauty Lab | `src/app/layout.tsx` (page title) |
| Nature's Beauty Lab | `src/app/admin/page.tsx` (admin header) |
| The Natural Beauty Lab | `src/app/page.tsx` (homepage quote attribution) |
| The Natural Beauty Lab | `src/app/about/page.tsx` (about page quote) |
| Natural Beauty Lab | `src/app/about/page.tsx` (body copy) |
| The Natural Beauty Lab | `src/app/product/[id]/page.tsx` (product detail spec) |

**Decision needed**: Canonical brand name should be ONE of:
- **Nature's Beauty Lab** (possessive, currently dominant in nav/footer)
- **Natural Beauty Lab** (descriptive, used in copy)
- **The Natural Beauty Lab** (definite article, used in attributions)

The domain is `thenaturalbeautylab.com` which suggests **The Natural Beauty Lab**.
