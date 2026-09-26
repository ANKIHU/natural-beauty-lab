"use client";

// =============================================================================
// ALLERGY AWARE — PDP component
// =============================================================================
// Compact disclosure + expandable panel. Driven entirely by ingredient data.
// Does NOT diagnose. Does NOT claim "allergy safe". INFORMS the customer.
// =============================================================================

import { useState } from "react";
import { type Product } from "@/lib/products";
import { getProductAllergyDisclosure, getProductAllergyProfile } from "@/lib/allergy-aware";
import { getIngredientRecord } from "@/lib/ingredients";

function ShieldLeafIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8 4 4 4 4 4s0 8 2 12c1.5 3 4 5 6 6 2-1 4.5-3 6-6 2-4 2-12 2-12s-4 0-8-2Z" stroke="var(--moss)" strokeWidth="1.6" fill="none" />
      <path d="M10 14C10 10 13 8 16 7C15 10 13 13 10 14Z" fill="var(--moss)" opacity="0.5" />
      <path d="M10 14C13 8 16 7 16 7" stroke="var(--moss)" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

export function AllergyAwareCompact({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false);
  const disclosure = getProductAllergyDisclosure(product);
  const profile = getProductAllergyProfile(product);

  return (
    <div style={{
      borderRadius: "var(--r-md)", border: "1px solid var(--sage-soft)",
      background: "rgba(220,227,212,0.15)", overflow: "hidden",
    }}>
      {/* Compact summary */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls="allergy-aware-panel"
        style={{
          width: "100%", display: "flex", alignItems: "flex-start", gap: 10,
          padding: "12px 14px", background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <ShieldLeafIcon size={18} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em",
            color: "var(--moss)", margin: "0 0 3px", textTransform: "uppercase",
          }}>
            Allergy Aware
          </p>
          {disclosure.hasSpecificData ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {disclosure.sections.slice(0, 3).map((s) => (
                <p key={s.title} style={{ fontSize: 12.5, color: "var(--ink)", margin: 0, lineHeight: 1.4 }}>
                  • {s.title}
                </p>
              ))}
              {disclosure.sections.length > 3 && (
                <p style={{ fontSize: 12.5, color: "var(--muted)", margin: 0 }}>
                  + {disclosure.sections.length - 3} more
                </p>
              )}
            </div>
          ) : (
            <p style={{ fontSize: 12.5, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
              {disclosure.compactSummary}
            </p>
          )}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, color: "var(--moss)", whiteSpace: "nowrap",
          marginTop: 2,
        }}>
          {expanded ? "Close ▲" : "View details ▼"}
        </span>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div
          id="allergy-aware-panel"
          role="region"
          aria-label="Allergy and sensitivity information"
          style={{
            padding: "0 14px 16px", borderTop: "1px solid var(--sage-soft)",
            display: "flex", flexDirection: "column", gap: 14,
          }}
        >
          {/* Guidance */}
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, margin: "12px 0 0" }}>
            {disclosure.guidance}
          </p>

          {/* Verified sections */}
          {disclosure.sections.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {disclosure.sections.map((section) => (
                <div key={section.title}>
                  <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", color: "var(--moss)", margin: "0 0 4px", textTransform: "uppercase" }}>
                    {section.title}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {section.items.map((item) => (
                      <span key={item} style={{
                        fontSize: 12, padding: "3px 8px", borderRadius: 999,
                        background: "var(--sage-soft)", color: "var(--ink)",
                      }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Data completeness notice */}
          {profile.reviewStatus === "INCOMPLETE" && (
            <p style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
              Allergy data review is in progress for some ingredients in this formula.
              Review the full ingredient list below for complete information.
            </p>
          )}

          {/* Full ingredient list */}
          <div>
            <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.04em", color: "var(--moss)", margin: "0 0 6px", textTransform: "uppercase" }}>
              Full ingredient list
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {product.ingredients.map(([name, role]) => {
                const record = getIngredientRecord(name);
                const isSensitive = record?.sensitivityRelevant;
                return (
                  <div key={name} style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    padding: "6px 8px", borderRadius: "var(--r-sm)",
                    background: isSensitive ? "rgba(193,146,47,0.06)" : "transparent",
                    border: isSensitive ? "1px solid rgba(193,146,47,0.15)" : "1px solid transparent",
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: isSensitive ? 600 : 400, color: "var(--ink)", margin: 0 }}>
                        {name}
                        {isSensitive && (
                          <span style={{ fontSize: 10, marginLeft: 6, color: "var(--honey)", fontWeight: 700, verticalAlign: "super" }}>●</span>
                        )}
                      </p>
                      {record?.inciName && (
                        <p style={{ fontSize: 11, color: "var(--muted)", margin: "1px 0 0", fontStyle: "italic" }}>
                          {record.inciName}
                        </p>
                      )}
                      <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "1px 0 0" }}>{role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
              <span style={{ color: "var(--honey)", fontWeight: 700 }}>●</span> Sensitivity-relevant ingredient
            </p>
          </div>

          {/* Warnings */}
          {profile.customerWarnings.length > 0 && (
            <div style={{ padding: "8px 10px", borderRadius: "var(--r-sm)", background: "rgba(193,146,47,0.06)", border: "1px solid rgba(193,146,47,0.15)" }}>
              {profile.customerWarnings.map((w, i) => (
                <p key={i} style={{ fontSize: 12.5, color: "var(--ink)", margin: 0, lineHeight: 1.5 }}>{w}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Product card badge (max 2 verified badges) ──────────────────────────

export function AllergyAwareBadges({ product }: { product: Product }) {
  const { essentialOilFree, fragranceFree, beeIngredientFree } =
    // Inline import to avoid circular
    require("@/lib/allergy-aware").getProductFreeFromEligibility(product);

  const badges: string[] = [];
  if (fragranceFree === "eligible" && essentialOilFree === "eligible") badges.push("No fragrance or essential oils");
  else if (fragranceFree === "eligible") badges.push("No added fragrance");
  else if (essentialOilFree === "eligible") badges.push("Essential-oil-free");
  if (beeIngredientFree === "eligible") badges.push("Bee-ingredient-free");

  if (badges.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {badges.slice(0, 2).map((b) => (
        <span key={b} style={{
          fontSize: 10, fontWeight: 600, letterSpacing: "0.03em",
          padding: "2px 7px", borderRadius: 999,
          background: "var(--sage-soft)", color: "var(--moss)",
        }}>
          {b}
        </span>
      ))}
    </div>
  );
}
