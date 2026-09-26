# Allergy Aware System — Architecture Audit

## Existing Architecture

### Data Model
- **No database** — products.ts is the canonical data store (in-memory TypeScript array)
- **No Supabase/Prisma/PostgreSQL** — pure static Next.js site
- **Product type**: `{ id, name, category, focus, price, size, vessel, desc, pitch, ingredients: [name, desc][], howto, shelf, stock, active, badge, rating, reviews, image? }`
- **Ingredients**: stored as `[string, string][]` tuples (name + role description) per product — NOT a separate normalised model
- **No Ingredient model** — ingredients exist only as inline arrays within each product
- **No ProductIngredient join** — direct array relationship
- **No INCI names** — ingredients use consumer-friendly names only

### Product Catalogue
- 37 active products (27 original + 10 men's grooming)
- 83 unique ingredient names across all products
- Ingredients are NOT normalised — same ingredient may appear with slightly different descriptions across products

### Existing Claims Found (require review)
| Location | Claim | Status |
|---|---|---|
| products.ts:68 | "safe for even the most reactive skin" (Oat Cleanser) | REQUIRES REVIEW |
| products.ts:104 | "safe for most skin" (Balancing Oil) | REQUIRES REVIEW |
| products.ts:68 | "no essential oils" (Oat Cleanser) | Factual — verify against ingredients |
| products.ts:243 | "fragrance-free" (Post-Shave Gel) | Factual — verify against ingredients |
| products.ts:64 | "antiseptic properties" (Lavender EO) | REQUIRES REVIEW — therapeutic claim |

### Sensitivity-Relevant Ingredients Found
| Category | Count | Ingredients |
|---|---|---|
| Essential Oils | 8 | Lavender, Tea tree, Geranium, Frankincense, Chamomile, Rosemary, Peppermint, Carrot seed |
| Bee-Derived | 2 | Raw honey, Beeswax |
| Nut/Seed/Tree-Derived | 5 | Virgin coconut oil, Argan oil, Sweet almond oil, Shea butter, Black castor oil |
| Dairy-Related | 1 | Live yogurt cultures |

### Architecture Approach
Since there's no database, the Allergy Aware system must:
1. Extend the in-memory `products.ts` data model
2. Create a normalised ingredient registry with allergy metadata
3. Derive product allergy profiles from ingredient data
4. All data lives in TypeScript — no migrations needed

### What Needs to Change
1. **Create**: `src/lib/ingredients.ts` — centralised ingredient registry with allergy metadata
2. **Create**: `src/lib/allergy-aware.ts` — derivation engine
3. **Create**: `src/components/AllergyAware.tsx` — PDP component
4. **Extend**: Product type with `allergyProfile` (derived, not stored)
5. **Extend**: Shop filters with preference filters
6. **Extend**: Admin with ingredient allergy editor + product completeness
7. **Extend**: Product cards with verified preference badges
8. **Create**: Label data export capability
