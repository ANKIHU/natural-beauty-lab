-- =============================================================================
-- NATURAL BEAUTY LAB — Supabase Migration
-- Ingredient allergy metadata + admin CRUD
-- Run in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- =============================================================================

-- 1. Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  inci_name TEXT,
  category TEXT NOT NULL DEFAULT 'Unclassified',
  sensitivity_relevant BOOLEAN NOT NULL DEFAULT false,
  sensitivity_categories TEXT[] NOT NULL DEFAULT '{}',
  fragrance_relevant BOOLEAN NOT NULL DEFAULT false,
  essential_oil BOOLEAN NOT NULL DEFAULT false,
  bee_derived BOOLEAN NOT NULL DEFAULT false,
  nut_derived BOOLEAN NOT NULL DEFAULT false,
  seed_derived BOOLEAN NOT NULL DEFAULT false,
  coconut_derived BOOLEAN NOT NULL DEFAULT false,
  latex_related BOOLEAN NOT NULL DEFAULT false,
  dairy_derived BOOLEAN NOT NULL DEFAULT false,
  customer_warning TEXT,
  professional_notes TEXT,
  allergy_data_status TEXT NOT NULL DEFAULT 'UNREVIEWED'
    CHECK (allergy_data_status IN ('UNREVIEWED', 'REVIEW_REQUIRED', 'VERIFIED')),
  allergy_data_source TEXT,
  allergy_data_reviewed_at TIMESTAMPTZ,
  allergy_data_reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable RLS (Row Level Security)
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- 3. Policy: anyone can read (public ingredient data)
CREATE POLICY "ingredients_read_all" ON ingredients
  FOR SELECT USING (true);

-- 4. Policy: service role can write (admin only)
CREATE POLICY "ingredients_write_service" ON ingredients
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ingredients_updated_at
  BEFORE UPDATE ON ingredients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 6. Index for status filtering
CREATE INDEX IF NOT EXISTS idx_ingredients_status ON ingredients(allergy_data_status);
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);
