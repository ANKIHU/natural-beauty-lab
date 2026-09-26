# Allergy Claims Audit

## Claims Found in Product Data

| Location | Claim | Classification |
|---|---|---|
| products.ts:68 (p02 Oat Cleanser) | "safe for even the most reactive skin" | **REQUIRES REVIEW** — absolute safety claim without substantiation |
| products.ts:104 (p08 Balancing Oil) | "safe for most skin" | **REQUIRES REVIEW** — qualified safety claim but still unsubstantiated |
| products.ts:243 (mg04 Post-Shave Gel) | "fragrance-free" | **VERIFIED** — formulation contains no fragrance ingredients or essential oils |
| products.ts:64 (p01 Soap) | "natural antiseptic properties" (Lavender EO) | **REQUIRES REVIEW** — antiseptic is a therapeutic/drug claim |

## Claims NOT Found (Good)
- No "allergen-free" claims
- No "hypoallergenic" claims
- No "non-toxic" claims
- No "chemical-free" claims
- No "100% safe" claims
- No "dermatologist tested/approved" claims

## Internal Code (Correct — Not Customer-Facing)
- AllergyAware.tsx: "Does NOT claim 'allergy safe'" — code comment only
- ingredients.ts: "'safe for sensitive skin' → product CLAIM" — code comment only
- allergy-aware.ts: "does not claim 'allergy safe'" — code comment only

## Recommendations
1. **p02**: Reword "safe for even the most reactive skin" → "designed for sensitive skin" or "formulated without common irritants"
2. **p08**: Reword "safe for most skin" → "suitable for normal to combination skin"
3. **p01**: Remove "antiseptic properties" → "traditionally used in skincare formulations"
4. **mg04**: "fragrance-free" is factual and verifiable — retain

## Owner Decision Required
- Whether to reword the flagged claims now or during next product copy review
- Whether "fragrance-free" as a product claim requires formal verification beyond ingredient-level data
