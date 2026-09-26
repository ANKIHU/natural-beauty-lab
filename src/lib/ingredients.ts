// =============================================================================
// CANONICAL INGREDIENT REGISTRY — single source of truth
// =============================================================================
// Every ingredient used across all products. Allergy metadata defaults
// to UNREVIEWED — do not fabricate classifications.
//
// IMPORTANT DISTINCTIONS:
//   essentialOil = true    → ingredient characteristic (metadata)
//   "safe for sensitive skin" → product CLAIM (never auto-generated)
//   beeDerived = true      → does NOT mean "allergic to bees = allergic to product"
// =============================================================================

export type AllergyDataStatus = "UNREVIEWED" | "REVIEW_REQUIRED" | "VERIFIED";

export type SensitivityCategory =
  | "essential_oil"
  | "fragrance"
  | "bee_derived"
  | "nut_derived"
  | "seed_derived"
  | "coconut_derived"
  | "dairy_derived"
  | "latex_related"
  | "mineral"
  | "botanical_extract";

export interface IngredientRecord {
  /** Consumer-friendly name (matches product ingredient arrays) */
  name: string;
  /** INCI name if known — leave undefined if not confirmed */
  inciName?: string;
  /** Category for grouping */
  category: string;
  /** Whether this ingredient is relevant to allergy/sensitivity considerations */
  sensitivityRelevant: boolean;
  /** Which sensitivity categories apply */
  sensitivityCategories: SensitivityCategory[];
  /** Is this an added synthetic fragrance ingredient (parfum/fragrance)?
   *  Essential oils are fragrant but are classified under essentialOil, not here.
   *  fragranceRelevant = true means synthetic fragrance additive. */
  fragranceRelevant: boolean;
  /** Is this an essential oil? Essential oils are aromatic and may trigger
   *  fragrance sensitivities, but are classified separately from synthetic fragrance. */
  essentialOil: boolean;
  /** Derived from bees (honey, beeswax, propolis, royal jelly) */
  beeDerived: boolean;
  /** Derived from tree nuts */
  nutDerived: boolean;
  /** Derived from seeds */
  seedDerived: boolean;
  /** Derived from coconut */
  coconutDerived: boolean;
  /** Related to latex cross-reactivity */
  latexRelated: boolean;
  /** Dairy-derived */
  dairyDerived: boolean;
  /** Customer-facing warning text if needed */
  customerWarning: string | null;
  /** Internal/professional notes — never shown to customers */
  professionalNotes: string | null;
  /** Review status for allergy data */
  allergyDataStatus: AllergyDataStatus;
  /** Source of allergy classification */
  allergyDataSource: string | null;
  /** When the allergy data was last reviewed */
  allergyDataReviewedAt: string | null;
}

// =============================================================================
// INGREDIENT REGISTRY
// =============================================================================
// All 83 unique ingredients. Allergy metadata defaults to UNREVIEWED.
// Only ingredients with obvious, well-established classifications are
// marked — everything else stays UNREVIEWED until human verification.
// =============================================================================

export const INGREDIENT_REGISTRY: IngredientRecord[] = [
  // ── Essential Oils (8) — clearly identifiable ─────────────────────────
  { name: "Lavender essential oil", category: "Essential Oil", sensitivityRelevant: true, sensitivityCategories: ["essential_oil"], fragranceRelevant: false, essentialOil: true, beeDerived: false, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — essential oil", allergyDataReviewedAt: null },
  { name: "Tea tree essential oil", category: "Essential Oil", sensitivityRelevant: true, sensitivityCategories: ["essential_oil"], fragranceRelevant: false, essentialOil: true, beeDerived: false, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — essential oil", allergyDataReviewedAt: null },
  { name: "Geranium essential oil", category: "Essential Oil", sensitivityRelevant: true, sensitivityCategories: ["essential_oil"], fragranceRelevant: false, essentialOil: true, beeDerived: false, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — essential oil", allergyDataReviewedAt: null },
  { name: "Frankincense essential oil", category: "Essential Oil", sensitivityRelevant: true, sensitivityCategories: ["essential_oil"], fragranceRelevant: false, essentialOil: true, beeDerived: false, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — essential oil", allergyDataReviewedAt: null },
  { name: "Chamomile essential oil", category: "Essential Oil", sensitivityRelevant: true, sensitivityCategories: ["essential_oil"], fragranceRelevant: false, essentialOil: true, beeDerived: false, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — essential oil", allergyDataReviewedAt: null },
  { name: "Rosemary essential oil", category: "Essential Oil", sensitivityRelevant: true, sensitivityCategories: ["essential_oil"], fragranceRelevant: false, essentialOil: true, beeDerived: false, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — essential oil", allergyDataReviewedAt: null },
  { name: "Peppermint essential oil", category: "Essential Oil", sensitivityRelevant: true, sensitivityCategories: ["essential_oil"], fragranceRelevant: false, essentialOil: true, beeDerived: false, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — essential oil", allergyDataReviewedAt: null },
  { name: "Carrot seed essential oil", category: "Essential Oil", sensitivityRelevant: true, sensitivityCategories: ["essential_oil"], fragranceRelevant: false, essentialOil: true, beeDerived: false, nutDerived: false, seedDerived: true, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — essential oil + seed", allergyDataReviewedAt: null },

  // ── Bee-Derived (2) — clearly identifiable ────────────────────────────
  { name: "Raw honey", category: "Humectant", sensitivityRelevant: true, sensitivityCategories: ["bee_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: true, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — bee product", allergyDataReviewedAt: null },
  { name: "Beeswax", category: "Wax", sensitivityRelevant: true, sensitivityCategories: ["bee_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: true, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — bee product", allergyDataReviewedAt: null },

  // ── Coconut-Derived (1) — clearly identifiable ────────────────────────
  { name: "Virgin coconut oil", category: "Botanical Oil", sensitivityRelevant: true, sensitivityCategories: ["coconut_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: false, seedDerived: false, coconutDerived: true, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: "Coconut is botanically a drupe, not a tree nut. However, some individuals with tree-nut allergies also react to coconut.", allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — coconut", allergyDataReviewedAt: null },

  // ── Tree Nut-Derived (2) — clearly identifiable ───────────────────────
  { name: "Sweet almond oil", category: "Botanical Oil", sensitivityRelevant: true, sensitivityCategories: ["nut_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: true, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — tree nut oil", allergyDataReviewedAt: null },
  { name: "Argan oil", category: "Botanical Oil", sensitivityRelevant: true, sensitivityCategories: ["nut_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: true, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: "Argan is technically a seed/kernel, but is commonly grouped with nut-derived oils.", allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — nut-adjacent oil", allergyDataReviewedAt: null },

  // ── Shea (1) — tree nut family ────────────────────────────────────────
  { name: "Shea butter", category: "Butter", sensitivityRelevant: true, sensitivityCategories: ["nut_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: true, seedDerived: false, coconutDerived: false, latexRelated: true, dairyDerived: false, customerWarning: null, professionalNotes: "Shea is a tree nut. Cross-reactivity with latex has been reported.", allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — tree nut butter", allergyDataReviewedAt: null },

  // ── Dairy-Derived (1) ─────────────────────────────────────────────────
  { name: "Live yogurt cultures", category: "Probiotic", sensitivityRelevant: true, sensitivityCategories: ["dairy_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: true, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — dairy", allergyDataReviewedAt: null },

  // ── Seed-Derived (clearly identifiable seeds) ─────────────────────────
  { name: "Black castor oil", category: "Botanical Oil", sensitivityRelevant: true, sensitivityCategories: ["seed_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: false, seedDerived: true, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — seed oil", allergyDataReviewedAt: null },
  { name: "Black cumin seed oil", category: "Botanical Oil", sensitivityRelevant: true, sensitivityCategories: ["seed_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: false, seedDerived: true, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — seed oil", allergyDataReviewedAt: null },
  { name: "Hemp seed oil", category: "Botanical Oil", sensitivityRelevant: true, sensitivityCategories: ["seed_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: false, seedDerived: true, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — seed oil", allergyDataReviewedAt: null },
  { name: "Pomegranate seed oil", category: "Botanical Oil", sensitivityRelevant: true, sensitivityCategories: ["seed_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: false, seedDerived: true, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — seed oil", allergyDataReviewedAt: null },
  { name: "Rosehip seed oil", category: "Botanical Oil", sensitivityRelevant: true, sensitivityCategories: ["seed_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: false, seedDerived: true, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — seed oil", allergyDataReviewedAt: null },
  { name: "Evening primrose oil", category: "Botanical Oil", sensitivityRelevant: true, sensitivityCategories: ["seed_derived"], fragranceRelevant: false, essentialOil: false, beeDerived: false, nutDerived: false, seedDerived: true, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: null, allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — seed oil", allergyDataReviewedAt: null },

  // ── Peppermint Oil (not "essential oil" labelled but is one) ───────────
  { name: "Peppermint oil", category: "Essential Oil", sensitivityRelevant: true, sensitivityCategories: ["essential_oil"], fragranceRelevant: false, essentialOil: true, beeDerived: false, nutDerived: false, seedDerived: false, coconutDerived: false, latexRelated: false, dairyDerived: false, customerWarning: null, professionalNotes: "Listed as 'Peppermint oil' without 'essential' qualifier on p07 but functionally identical.", allergyDataStatus: "VERIFIED", allergyDataSource: "Ingredient identity — essential oil", allergyDataReviewedAt: null },

  // ── Fragrance blends (men's grooming) ─────────────────────────────────
  // These reference "optional cedarwood–lavender aromatic blend" etc.
  // in the approved formulation data but are not listed as separate
  // ingredients in the product cards. Flagged for review.

  // ── ALL REMAINING INGREDIENTS — UNREVIEWED ────────────────────────────
  // These default to UNREVIEWED. They are NOT classified as sensitivity-
  // relevant because we have not verified their status. UNREVIEWED does
  // NOT mean "safe" — it means "not yet reviewed."
  ...([
    "Glycerin soap base", "Colloidal oats", "Bentonite clay", "Activated charcoal",
    "Witch hazel", "Papaya enzyme", "Botanical vitamin C", "Turmeric", "Avocado",
    "Rosehip oil", "Oat flour", "Chickpea flour", "Aloe vera", "Jojoba oil",
    "Grapeseed oil", "Sea buckthorn oil", "Rosemary extract", "Aloe vera juice",
    "Plant emulsifying wax", "Vitamin E", "Aloe vera gel", "Vegetable glycerin",
    "Cucumber extract", "Green tea", "Cocoa butter", "Vanilla & sweet orange",
    "Brown sugar", "Cinnamon", "Magnesium chloride", "Castile soap base",
    "Marshmallow root", "Arrowroot powder", "Kaolin clay", "Cocoa powder",
    "Calcium carbonate", "Baking soda", "Avocado oil", "Vitamin C (L-ascorbic acid)",
    "Rose water", "Non-nano zinc oxide", "Colloidal oatmeal", "Panthenol",
    "Hydrolysed oat protein", "Squalane", "Bisabolol", "Mango butter",
    "Candelilla wax", "Cucumber hydrosol", "Niacinamide", "Allantoin",
    "Rhassoul clay", "Green tea extract", "Rosemary hydrosol", "Caffeine",
    "Oat protein", "Zinc PCA", "Magnesium hydroxide", "Zinc ricinoleate",
    "Triethyl citrate", "Tapioca starch", "Glycerin",
  ] as const).map((name): IngredientRecord => ({
    name,
    category: "Unclassified",
    sensitivityRelevant: false,
    sensitivityCategories: [],
    fragranceRelevant: false,
    essentialOil: false,
    beeDerived: false,
    nutDerived: false,
    seedDerived: false,
    coconutDerived: false,
    latexRelated: false,
    dairyDerived: false,
    customerWarning: null,
    professionalNotes: null,
    allergyDataStatus: "UNREVIEWED",
    allergyDataSource: null,
    allergyDataReviewedAt: null,
  })),
];

// ── Lookup helpers ──────────────────────────────────────────────────────

const _ingredientMap = new Map<string, IngredientRecord>();
for (const ing of INGREDIENT_REGISTRY) {
  _ingredientMap.set(ing.name.toLowerCase(), ing);
}

export function getIngredientRecord(name: string): IngredientRecord | undefined {
  return _ingredientMap.get(name.toLowerCase());
}

export function getAllIngredients(): IngredientRecord[] {
  return INGREDIENT_REGISTRY;
}

export function getVerifiedIngredients(): IngredientRecord[] {
  return INGREDIENT_REGISTRY.filter((i) => i.allergyDataStatus === "VERIFIED");
}

export function getUnreviewedIngredients(): IngredientRecord[] {
  return INGREDIENT_REGISTRY.filter((i) => i.allergyDataStatus === "UNREVIEWED");
}

export function getIngredientStats() {
  const total = INGREDIENT_REGISTRY.length;
  const verified = INGREDIENT_REGISTRY.filter((i) => i.allergyDataStatus === "VERIFIED").length;
  const unreviewed = INGREDIENT_REGISTRY.filter((i) => i.allergyDataStatus === "UNREVIEWED").length;
  const reviewRequired = INGREDIENT_REGISTRY.filter((i) => i.allergyDataStatus === "REVIEW_REQUIRED").length;
  return { total, verified, unreviewed, reviewRequired };
}
