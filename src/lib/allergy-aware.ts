// =============================================================================
// ALLERGY AWARE ENGINE — derives product allergy profiles from ingredient data
// =============================================================================
// IMPORTANT: This engine INFORMS. It does not diagnose.
// It does not claim any product is "allergy safe" or "allergen free".
// UNREVIEWED ingredients do NOT count as "free from".
// =============================================================================

import { type Product } from "./products";
import {
  getIngredientRecord,
  type IngredientRecord,
  type AllergyDataStatus,
  type SensitivityCategory,
} from "./ingredients";

// ── Types ───────────────────────────────────────────────────────────────

export interface AllergyProfile {
  /** Overall review status — INCOMPLETE if any ingredient is UNREVIEWED */
  reviewStatus: "COMPLETE" | "INCOMPLETE";
  /** Number of ingredients with verified allergy data */
  verifiedCount: number;
  /** Number of unreviewed ingredients */
  unreviewedCount: number;
  /** Total ingredient count */
  totalCount: number;
  /** Contains essential oils? */
  hasEssentialOils: boolean;
  /** Contains bee-derived ingredients? */
  hasBeeDerived: boolean;
  /** Contains nut-derived ingredients? */
  hasNutDerived: boolean;
  /** Contains seed-derived ingredients? */
  hasSeedDerived: boolean;
  /** Contains coconut-derived ingredients? */
  hasCoconutDerived: boolean;
  /** Contains dairy-derived ingredients? */
  hasDairyDerived: boolean;
  /** Contains latex-related ingredients? */
  hasLatexRelated: boolean;
  /** Contains synthetic fragrance additive (parfum)? Separate from essential oils. */
  hasAddedFragrance: boolean;
  /** All sensitivity categories present in this product */
  sensitivityCategories: SensitivityCategory[];
  /** Specific ingredient records that are sensitivity-relevant */
  sensitiveIngredients: IngredientRecord[];
  /** Unreviewed ingredient names (for admin) */
  unreviewedIngredientNames: string[];
  /** Product-specific customer warnings (from individual ingredients) */
  customerWarnings: string[];
}

export interface FreeFromEligibility {
  essentialOilFree: "eligible" | "ineligible" | "unverifiable";
  fragranceFree: "eligible" | "ineligible" | "unverifiable";
  beeIngredientFree: "eligible" | "ineligible" | "unverifiable";
  nutOilFree: "eligible" | "ineligible" | "unverifiable";
  coconutFree: "eligible" | "ineligible" | "unverifiable";
  dairyFree: "eligible" | "ineligible" | "unverifiable";
}

export interface AllergyDisclosure {
  /** Compact summary for PDP */
  compactSummary: string;
  /** Detailed sections for the expanded panel */
  sections: { title: string; items: string[] }[];
  /** Default guidance text */
  guidance: string;
  /** Whether the data is complete enough for specific disclosures */
  hasSpecificData: boolean;
}

// ── Core derivation ─────────────────────────────────────────────────────

export function getProductAllergyProfile(product: Product): AllergyProfile {
  const records: (IngredientRecord | undefined)[] = product.ingredients.map(
    ([name]) => getIngredientRecord(name)
  );

  const verified = records.filter((r) => r?.allergyDataStatus === "VERIFIED");
  const unreviewed = product.ingredients.filter(
    ([name]) => {
      const r = getIngredientRecord(name);
      return !r || r.allergyDataStatus === "UNREVIEWED";
    }
  );

  const sensitiveIngredients = records.filter(
    (r): r is IngredientRecord => !!r && r.sensitivityRelevant
  );

  const categories = new Set<SensitivityCategory>();
  for (const r of sensitiveIngredients) {
    for (const cat of r.sensitivityCategories) categories.add(cat);
  }

  const warnings: string[] = [];
  for (const r of records) {
    if (r?.customerWarning) warnings.push(r.customerWarning);
  }

  return {
    reviewStatus: unreviewed.length === 0 ? "COMPLETE" : "INCOMPLETE",
    verifiedCount: verified.length,
    unreviewedCount: unreviewed.length,
    totalCount: product.ingredients.length,
    hasEssentialOils: sensitiveIngredients.some((r) => r.essentialOil),
    hasBeeDerived: sensitiveIngredients.some((r) => r.beeDerived),
    hasNutDerived: sensitiveIngredients.some((r) => r.nutDerived),
    hasSeedDerived: sensitiveIngredients.some((r) => r.seedDerived),
    hasCoconutDerived: sensitiveIngredients.some((r) => r.coconutDerived),
    hasDairyDerived: sensitiveIngredients.some((r) => r.dairyDerived),
    hasLatexRelated: sensitiveIngredients.some((r) => r.latexRelated),
    hasAddedFragrance: sensitiveIngredients.some((r) => r.fragranceRelevant),
    sensitivityCategories: [...categories],
    sensitiveIngredients,
    unreviewedIngredientNames: unreviewed.map(([name]) => name),
    customerWarnings: warnings,
  };
}

// ── Free-from eligibility (conservative) ────────────────────────────────
// A product is "eligible" for a free-from claim ONLY if:
// 1. ALL ingredients have been reviewed (no UNREVIEWED)
// 2. NONE are classified under that category
// If any ingredient is UNREVIEWED → "unverifiable" (NOT "eligible")

export function getProductFreeFromEligibility(product: Product): FreeFromEligibility {
  const profile = getProductAllergyProfile(product);
  const complete = profile.reviewStatus === "COMPLETE";

  return {
    essentialOilFree: !complete ? "unverifiable" : profile.hasEssentialOils ? "ineligible" : "eligible",
    fragranceFree: !complete ? "unverifiable" : profile.hasAddedFragrance ? "ineligible" : "eligible",
    beeIngredientFree: !complete ? "unverifiable" : profile.hasBeeDerived ? "ineligible" : "eligible",
    nutOilFree: !complete ? "unverifiable" : profile.hasNutDerived ? "ineligible" : "eligible",
    coconutFree: !complete ? "unverifiable" : profile.hasCoconutDerived ? "ineligible" : "eligible",
    dairyFree: !complete ? "unverifiable" : profile.hasDairyDerived ? "ineligible" : "eligible",
  };
}

// ── Customer-facing disclosure ──────────────────────────────────────────

export function getProductAllergyDisclosure(product: Product): AllergyDisclosure {
  const profile = getProductAllergyProfile(product);

  const sections: { title: string; items: string[] }[] = [];

  // Only show specific categories when data is verified
  if (profile.reviewStatus === "COMPLETE" || profile.sensitiveIngredients.length > 0) {
    if (profile.hasEssentialOils) {
      const eos = profile.sensitiveIngredients.filter((r) => r.essentialOil).map((r) => r.name);
      sections.push({ title: "Essential oils", items: eos });
    }
    if (profile.hasBeeDerived) {
      const bees = profile.sensitiveIngredients.filter((r) => r.beeDerived).map((r) => r.name);
      sections.push({ title: "Bee-derived ingredients", items: bees });
    }
    if (profile.hasNutDerived) {
      const nuts = profile.sensitiveIngredients.filter((r) => r.nutDerived).map((r) => r.name);
      sections.push({ title: "Nut-derived ingredients", items: nuts });
    }
    if (profile.hasCoconutDerived) {
      sections.push({ title: "Coconut-derived ingredients", items: profile.sensitiveIngredients.filter((r) => r.coconutDerived).map((r) => r.name) });
    }
    if (profile.hasSeedDerived) {
      const seeds = profile.sensitiveIngredients.filter((r) => r.seedDerived).map((r) => r.name);
      sections.push({ title: "Seed-derived ingredients", items: seeds });
    }
    if (profile.hasDairyDerived) {
      sections.push({ title: "Dairy-derived ingredients", items: profile.sensitiveIngredients.filter((r) => r.dairyDerived).map((r) => r.name) });
    }
    if (profile.hasLatexRelated) {
      sections.push({ title: "Latex cross-reactivity consideration", items: profile.sensitiveIngredients.filter((r) => r.latexRelated).map((r) => r.name) });
    }
  }

  const hasSpecificData = sections.length > 0;

  const compactSummary = hasSpecificData
    ? `Contains: ${sections.map((s) => s.title.toLowerCase()).join(", ")}.`
    : "Review the full ingredient list before use if you have known allergies or sensitivities.";

  return {
    compactSummary,
    sections,
    guidance: "If you have known allergies or sensitivities, review the full ingredient list before using this product. Natural ingredients can also cause sensitivity or allergic reactions. Discontinue use if irritation occurs.",
    hasSpecificData,
  };
}

// ── Label data export ───────────────────────────────────────────────────

export interface LabelAllergyData {
  productId: string;
  productName: string;
  allergyAwareText: string;
  sensitivityCategories: string[];
  fullIngredientList: string[];
  warnings: string[];
  directions: string;
  storage: string;
  reviewStatus: AllergyDataStatus;
}

export function getProductLabelAllergyData(product: Product): LabelAllergyData {
  const profile = getProductAllergyProfile(product);
  const disclosure = getProductAllergyDisclosure(product);

  return {
    productId: product.id,
    productName: product.name,
    allergyAwareText: disclosure.guidance,
    sensitivityCategories: profile.sensitivityCategories,
    fullIngredientList: product.ingredients.map(([name]) => name),
    warnings: profile.customerWarnings,
    directions: product.howto,
    storage: product.shelf,
    reviewStatus: profile.reviewStatus === "COMPLETE" ? "VERIFIED" : "UNREVIEWED",
  };
}
