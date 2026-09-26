-- =============================================================================
-- NATURAL BEAUTY LAB — Migration 002: Customers + Orders + Order Items
-- Run in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- =============================================================================

-- 1. Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT NOT NULL DEFAULT 'United Kingdom',
  notes TEXT,
  order_count INT NOT NULL DEFAULT 0,
  total_spent_cents BIGINT NOT NULL DEFAULT 0,
  first_order_at TIMESTAMPTZ,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "customers_read_service" ON customers FOR SELECT USING (true);
CREATE POLICY "customers_write_service" ON customers FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_last_order ON customers(last_order_at DESC);

-- 2. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal_cents BIGINT NOT NULL,
  shipping_cents BIGINT NOT NULL DEFAULT 0,
  total_cents BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  -- Stripe
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_payment_status TEXT,
  -- Delivery
  delivery_name TEXT,
  delivery_email TEXT,
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_country TEXT,
  delivery_note TEXT,
  -- Timestamps
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_read_service" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_write_service" ON orders FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- 3. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price_cents BIGINT NOT NULL,
  line_total_cents BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_read_service" ON order_items FOR SELECT USING (true);
CREATE POLICY "order_items_write_service" ON order_items FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- 4. Triggers
CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
