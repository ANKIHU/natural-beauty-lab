"use client";

import { useState, useCallback } from "react";
import { money, FREE_SHIPPING_THRESHOLD, CATEGORIES, type Product, getActiveProducts } from "@/lib/products";
import { adminStore, type Order } from "@/lib/admin-store";
import { BrandMark, CloseIcon } from "@/components/Icons";
import { getIngredientStats, getAllIngredients, type IngredientRecord, type AllergyDataStatus } from "@/lib/ingredients";
import { getProductAllergyProfile } from "@/lib/allergy-aware";
import Image from "next/image";

const ADMIN_PASSWORD = "nbl2026";

type Tab = "dashboard" | "products" | "orders" | "customers" | "ingredients" | "allergy-data";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender((n) => n + 1), []);

  if (!authed) {
    return (
      <div className="wrap">
        <div className="gatecard">
          <div style={{ marginBottom: 14 }}><BrandMark /></div>
          <h2>Admin portal</h2>
          <p>Enter the store password to access the admin dashboard.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === ADMIN_PASSWORD) {
                setAuthed(true);
                setError("");
              } else {
                setError("Incorrect password");
              }
            }}
            style={{ marginTop: 20 }}
          >
            <div className="field" style={{ maxWidth: 300, margin: "0 auto" }}>
              <input
                type="password"
                placeholder="Store password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p style={{ color: "var(--clay)", fontSize: 14, marginTop: 8 }}>{error}</p>}
            <button className="btn btn-moss" type="submit" style={{ marginTop: 14 }}>
              Enter admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-head">
        <div className="wrap">
          <h1>Store admin</h1>
          <p>Nature&apos;s Beauty Lab · Session catalog ({adminStore.getProducts().length} products)</p>
          <div className="atabs">
            {(["dashboard", "products", "orders", "customers", "ingredients", "allergy-data"] as Tab[]).map((t) => (
              <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="admin-body">
        <div className="wrap">
          {tab === "dashboard" && <Dashboard onNavigate={setTab} />}
          {tab === "products" && <ProductsPanel rerender={rerender} />}
          {tab === "orders" && <DbOrdersPanel />}
          {tab === "customers" && <CustomersPanel />}
          {tab === "ingredients" && <IngredientsPanel />}
          {tab === "allergy-data" && <AllergyDataPanel />}
        </div>
      </div>
    </>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const stats = adminStore.getStats();
  const recent = adminStore.orders.slice(0, 6);

  return (
    <>
      <div className="statgrid">
        <div className="stat">
          <div className="lbl">REVENUE</div>
          <div className="val">{money(stats.revenue)}</div>
          <div className="sub-text">{stats.orderCount - (stats.orderCount - adminStore.orders.filter((o) => o.status !== "cancelled").length)} orders (excl. cancelled)</div>
        </div>
        <div className="stat">
          <div className="lbl">ORDERS</div>
          <div className="val">{stats.orderCount}</div>
          <div className="sub-text">{stats.processingCount} awaiting fulfilment</div>
        </div>
        <div className="stat">
          <div className="lbl">UNITS SOLD</div>
          <div className="val">{stats.units}</div>
          <div className="sub-text">across all orders</div>
        </div>
        <div className="stat">
          <div className="lbl">AVG ORDER</div>
          <div className="val">{money(stats.avgOrder)}</div>
          <div className="sub-text">free shipping over {money(FREE_SHIPPING_THRESHOLD)}</div>
        </div>
        <div className="stat">
          <div className="lbl">LOW STOCK</div>
          <div className="val">{stats.lowStock.length}</div>
          <div className="sub-text">
            {stats.lowStock.length
              ? stats.lowStock.slice(0, 2).map((p) => p.name).join(", ") + (stats.lowStock.length > 2 ? "..." : "")
              : "all batches healthy"}
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="phead">
          <h3>Recent orders</h3>
          <button className="btn btn-line" style={{ padding: "9px 18px" }} onClick={() => onNavigate("orders")}>
            All orders
          </button>
        </div>
        {recent.length ? (
          <OrderTable orders={recent} onUpdate={() => {}} />
        ) : (
          <div className="empty" style={{ padding: 40 }}>
            <div className="serif">No orders yet</div>
            <p>When customers check out, orders appear here.</p>
          </div>
        )}
      </div>
    </>
  );
}

function ProductsPanel({ rerender }: { rerender: () => void }) {
  const products = adminStore.getProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => {
    setIsNew(true);
    setEditing({
      id: "p" + Date.now().toString(36),
      order: Math.max(0, ...products.map((x) => x.order)) + 1,
      name: "",
      category: "Body",
      focus: "",
      price: 20,
      size: "",
      vessel: "jar",
      desc: "",
      pitch: "",
      ingredients: [],
      howto: "",
      shelf: "12 months",
      stock: 24,
      active: true,
      badge: "",
      rating: 4.7,
      reviews: 0,
    });
  };

  const openEdit = (p: Product) => {
    setIsNew(false);
    setEditing({ ...p });
  };

  const closeEditor = () => setEditing(null);

  const saveEditor = (product: Product) => {
    if (isNew) {
      adminStore.addProduct(product);
    } else {
      adminStore.updateProduct(product.id, product);
    }
    setEditing(null);
    rerender();
  };

  return (
    <>
      <div className="panel">
        <div className="phead">
          <h3>Products ({products.length})</h3>
          <button className="btn btn-moss" style={{ padding: "10px 20px" }} onClick={openNew}>
            + New product
          </button>
        </div>
        <div className="table-scroll">
          <table className="adm">
            <thead>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="tiny-art">
                      {p.image ? (
                        <Image src={p.image} alt={p.name} width={44} height={44} style={{ objectFit: "cover" }} />
                      ) : (
                        <span style={{ width: 44, height: 44, display: "block", background: "var(--sage-soft)", borderRadius: 6 }} />
                      )}
                    </span>
                  </td>
                  <td>
                    <b>{p.name}</b>
                    <br />
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>
                      {p.focus} · {p.size}
                      {p.badge ? ` · ${p.badge}` : ""}
                    </span>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <input
                      className="stock-in"
                      defaultValue={p.price.toFixed(2)}
                      inputMode="decimal"
                      style={{ width: 80 }}
                      onBlur={(e) => {
                        let n = parseFloat(e.target.value);
                        if (!(n >= 0)) n = 0;
                        e.target.value = n.toFixed(2);
                        adminStore.updateProduct(p.id, { price: n });
                        rerender();
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="stock-in"
                      defaultValue={p.stock}
                      inputMode="numeric"
                      onBlur={(e) => {
                        let n = parseInt(e.target.value, 10);
                        if (!(n >= 0)) n = 0;
                        e.target.value = String(n);
                        adminStore.updateProduct(p.id, { stock: n });
                        rerender();
                      }}
                    />
                  </td>
                  <td>
                    <span className={`pill ${p.active ? "live" : "hidden"}`}>
                      {p.active ? "live" : "hidden"}
                    </span>
                  </td>
                  <td>
                    <div className="rowact">
                      <button onClick={() => openEdit(p)}>Edit</button>
                      <button
                        onClick={() => {
                          adminStore.updateProduct(p.id, { active: !p.active });
                          rerender();
                        }}
                      >
                        {p.active ? "Hide" : "Show"}
                      </button>
                      <button
                        className="danger"
                        onClick={() => {
                          if (confirm(`Delete "${p.name}" permanently?`)) {
                            adminStore.deleteProduct(p.id);
                            rerender();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editing && (
        <ProductEditor
          product={editing}
          isNew={isNew}
          onSave={saveEditor}
          onClose={closeEditor}
        />
      )}
    </>
  );
}

function ProductEditor({
  product,
  isNew,
  onSave,
  onClose,
}: {
  product: Product;
  isNew: boolean;
  onSave: (p: Product) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [vessel, setVessel] = useState(product.vessel);
  const [price, setPrice] = useState(String(product.price));
  const [size, setSize] = useState(product.size);
  const [stock, setStock] = useState(String(product.stock));
  const [badge, setBadge] = useState(product.badge);
  const [focus, setFocus] = useState(product.focus);
  const [desc, setDesc] = useState(product.desc);
  const [pitch, setPitch] = useState(product.pitch);
  const [howto, setHowto] = useState(product.howto);
  const [shelf, setShelf] = useState(product.shelf);
  const [ings, setIngs] = useState(
    product.ingredients.map((i) => `${i[0]} — ${i[1]}`).join("\n")
  );

  const handleSave = () => {
    onSave({
      ...product,
      name: name.trim() || "Untitled product",
      category,
      vessel,
      price: Math.max(0, parseFloat(price) || 0),
      size: size.trim(),
      stock: Math.max(0, parseInt(stock, 10) || 0),
      badge,
      focus: focus.trim(),
      desc: desc.trim(),
      pitch: pitch.trim(),
      howto: howto.trim(),
      shelf: shelf.trim(),
      ingredients: ings
        .split("\n")
        .map((l) => l.split("—").map((s) => s.trim()))
        .filter((a) => a[0])
        .map((a) => [a[0], a[1] || ""] as [string, string]),
    });
  };

  return (
    <div className="modal-scrim open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="iconbtn x" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
        <h3>{isNew ? "New product" : "Edit product"}</h3>
        <div className="f-grid">
          <div className="field full">
            <label>NAME</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>CATEGORY</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>PACKAGING</label>
            <select value={vessel} onChange={(e) => setVessel(e.target.value)}>
              {["bar", "jar", "dropper", "pump", "bottle", "tube", "tin", "pot"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>PRICE (GBP)</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
          </div>
          <div className="field">
            <label>SIZE</label>
            <input value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 60 ml jar" />
          </div>
          <div className="field">
            <label>STOCK</label>
            <input value={stock} onChange={(e) => setStock(e.target.value)} inputMode="numeric" />
          </div>
          <div className="field">
            <label>BADGE</label>
            <select value={badge} onChange={(e) => setBadge(e.target.value)}>
              <option value="">none</option>
              <option value="bestseller">bestseller</option>
              <option value="new">new</option>
            </select>
          </div>
          <div className="field full">
            <label>BEST FOR (FOCUS)</label>
            <input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="e.g. Dry & mature skin" />
          </div>
          <div className="field full">
            <label>DESCRIPTION</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="field full">
            <label>THE PITCH (SECOND PARAGRAPH)</label>
            <textarea value={pitch} onChange={(e) => setPitch(e.target.value)} style={{ minHeight: 70 }} />
          </div>
          <div className="field full">
            <label>HOW TO USE</label>
            <textarea value={howto} onChange={(e) => setHowto(e.target.value)} style={{ minHeight: 70 }} />
          </div>
          <div className="field">
            <label>SHELF LIFE</label>
            <input value={shelf} onChange={(e) => setShelf(e.target.value)} />
          </div>
          <div className="field full">
            <label>KEY INGREDIENTS (name — role; one per line)</label>
            <textarea
              value={ings}
              onChange={(e) => setIngs(e.target.value)}
              style={{ minHeight: 90 }}
              placeholder="Shea butter — Deep moisture"
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button className="btn btn-moss" style={{ flex: 1 }} onClick={handleSave}>
            {isNew ? "Create product" : "Save changes"}
          </button>
          <button className="btn btn-line" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function OrdersPanel({ rerender }: { rerender: () => void }) {
  const orders = adminStore.orders;

  return (
    <div className="panel">
      <div className="phead">
        <h3>Orders ({orders.length})</h3>
      </div>
      {orders.length ? (
        <OrderTable orders={orders} onUpdate={rerender} />
      ) : (
        <div className="empty" style={{ padding: 50 }}>
          <div className="serif">No orders yet</div>
          <p>Orders placed at checkout land here.</p>
        </div>
      )}
    </div>
  );
}

function OrderTable({ orders, onUpdate }: { orders: Order[]; onUpdate: () => void }) {
  return (
    <div className="table-scroll">
      <table className="adm">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <b>{o.number}</b>
                <br />
                <span style={{ color: "var(--muted)", fontSize: 12 }}>
                  {new Date(o.createdAt).toLocaleString()}
                </span>
              </td>
              <td>
                {o.customer.name}
                <br />
                <span style={{ color: "var(--muted)", fontSize: 12 }}>{o.customer.city}</span>
              </td>
              <td>
                {o.items.map((i, idx) => (
                  <span key={idx}>
                    {i.qty}× {i.name}
                    {idx < o.items.length - 1 && <br />}
                  </span>
                ))}
              </td>
              <td><b>{money(o.total)}</b></td>
              <td><span className={`pill ${o.status}`}>{o.status}</span></td>
              <td>
                <div className="rowact">
                  <select
                    defaultValue={o.status}
                    onChange={(e) => {
                      adminStore.updateOrderStatus(o.id, e.target.value as Order["status"]);
                      onUpdate();
                    }}
                  >
                    {["processing", "shipped", "delivered", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// INGREDIENTS PANEL — Supabase-powered allergy metadata editor
// =============================================================================

function IngredientsPanel() {
  const [filter, setFilter] = useState<"all" | "UNREVIEWED" | "REVIEW_REQUIRED" | "VERIFIED">("all");
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Fetch from Supabase via API route
  const fetchIngredients = async () => {
    setLoading(true);
    const res = await fetch("/api/ingredients");
    const data = await res.json();
    setIngredients(data.ingredients || []);
    setLoading(false);
  };

  useState(() => { fetchIngredients(); });

  const filtered = filter === "all"
    ? ingredients
    : ingredients.filter((i: any) => i.allergy_data_status === filter);

  const statusColor = (s: string) =>
    s === "VERIFIED" ? "#22C55E" : s === "REVIEW_REQUIRED" ? "#F59E0B" : "#9CA3AF";
  const statusBg = (s: string) =>
    s === "VERIFIED" ? "rgba(34,197,94,0.08)" : s === "REVIEW_REQUIRED" ? "rgba(245,158,11,0.08)" : "rgba(0,0,0,0.03)";

  const saveIngredient = async (updates: any) => {
    setSaving(true);
    await fetch("/api/ingredients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editing.id, ...updates }),
    });
    setSaving(false);
    setEditing(null);
    fetchIngredients();
  };

  return (
    <>
      <div className="panel">
        <div className="phead">
          <h3>Ingredient Allergy Data ({filtered.length})</h3>
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", "UNREVIEWED", "REVIEW_REQUIRED", "VERIFIED"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "5px 12px", borderRadius: 8, border: "none", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                background: filter === f ? "var(--deep)" : "rgba(0,0,0,0.04)",
                color: filter === f ? "#fff" : "var(--ink)",
              }}>
                {f === "all" ? `All (${f === "all" ? ingredients.length : ""})` : f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Loading from database...</div>
        ) : (
          <div className="table-scroll">
            <table className="adm">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Category</th>
                  <th>EO</th>
                  <th>Bee</th>
                  <th>Nut</th>
                  <th>Seed</th>
                  <th>Coconut</th>
                  <th>Dairy</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ing: any) => (
                  <tr key={ing.id}>
                    <td>
                      <b>{ing.name}</b>
                      {ing.inci_name && <><br /><span style={{ color: "var(--muted)", fontSize: 12, fontStyle: "italic" }}>{ing.inci_name}</span></>}
                    </td>
                    <td style={{ fontSize: 12 }}>{ing.category}</td>
                    <td>{ing.essential_oil ? "●" : "—"}</td>
                    <td>{ing.bee_derived ? "●" : "—"}</td>
                    <td>{ing.nut_derived ? "●" : "—"}</td>
                    <td>{ing.seed_derived ? "●" : "—"}</td>
                    <td>{ing.coconut_derived ? "●" : "—"}</td>
                    <td>{ing.dairy_derived ? "●" : "—"}</td>
                    <td>
                      <span className="pill" style={{ background: statusBg(ing.allergy_data_status), color: statusColor(ing.allergy_data_status) }}>
                        {ing.allergy_data_status === "VERIFIED" ? "Verified" : ing.allergy_data_status === "REVIEW_REQUIRED" ? "Review" : "Unreviewed"}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => setEditing(ing)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--line)", background: "var(--paper)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ingredient editor modal */}
      {editing && (
        <IngredientEditorModal
          ingredient={editing}
          onSave={saveIngredient}
          onClose={() => setEditing(null)}
          saving={saving}
        />
      )}
    </>
  );
}

function IngredientEditorModal({ ingredient, onSave, onClose, saving }: {
  ingredient: any; onSave: (u: any) => void; onClose: () => void; saving: boolean;
}) {
  const [eo, setEo] = useState(ingredient.essential_oil);
  const [bee, setBee] = useState(ingredient.bee_derived);
  const [nut, setNut] = useState(ingredient.nut_derived);
  const [seed, setSeed] = useState(ingredient.seed_derived);
  const [coconut, setCoconut] = useState(ingredient.coconut_derived);
  const [dairy, setDairy] = useState(ingredient.dairy_derived);
  const [latex, setLatex] = useState(ingredient.latex_related);
  const [fragrance, setFragrance] = useState(ingredient.fragrance_relevant);
  const [cat, setCat] = useState(ingredient.category || "");
  const [inci, setInci] = useState(ingredient.inci_name || "");
  const [warning, setWarning] = useState(ingredient.customer_warning || "");
  const [notes, setNotes] = useState(ingredient.professional_notes || "");
  const [status, setStatus] = useState(ingredient.allergy_data_status || "UNREVIEWED");
  const [source, setSource] = useState(ingredient.allergy_data_source || "");

  const isSensitive = eo || bee || nut || seed || coconut || dairy || latex || fragrance;
  const cats: string[] = [];
  if (eo) cats.push("essential_oil");
  if (bee) cats.push("bee_derived");
  if (nut) cats.push("nut_derived");
  if (seed) cats.push("seed_derived");
  if (coconut) cats.push("coconut_derived");
  if (dairy) cats.push("dairy_derived");

  const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 7, border: "1.5px solid var(--line)", fontSize: 14, background: "var(--card)" };
  const checkStyle: React.CSSProperties = { accentColor: "var(--moss)", width: 16, height: 16 };

  return (
    <div className="modal-scrim open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <button className="iconbtn x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        <h3 style={{ marginBottom: 2 }}>{ingredient.name}</h3>
        <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 16px" }}>Allergy &amp; sensitivity metadata</p>

        <div className="f-grid">
          <div className="field">
            <label>Category</label>
            <input value={cat} onChange={(e) => setCat(e.target.value)} style={inputStyle} placeholder="e.g. Essential Oil, Botanical Oil" />
          </div>
          <div className="field">
            <label>INCI Name</label>
            <input value={inci} onChange={(e) => setInci(e.target.value)} style={inputStyle} placeholder="e.g. Lavandula Angustifolia Oil" />
          </div>

          <div className="field full">
            <label style={{ marginBottom: 8 }}>Sensitivity classifications</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                { label: "Essential oil", val: eo, set: setEo },
                { label: "Bee-derived", val: bee, set: setBee },
                { label: "Nut-derived", val: nut, set: setNut },
                { label: "Seed-derived", val: seed, set: setSeed },
                { label: "Coconut-derived", val: coconut, set: setCoconut },
                { label: "Dairy-derived", val: dairy, set: setDairy },
                { label: "Latex cross-reactivity", val: latex, set: setLatex },
                { label: "Added fragrance", val: fragrance, set: setFragrance },
              ].map((c) => (
                <label key={c.label} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13.5, cursor: "pointer" }}>
                  <input type="checkbox" checked={c.val} onChange={(e) => c.set(e.target.checked)} style={checkStyle} />
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          <div className="field full">
            <label>Customer warning (visible on PDP)</label>
            <input value={warning} onChange={(e) => setWarning(e.target.value)} style={inputStyle} placeholder="Optional — shown to customers" />
          </div>
          <div className="field full">
            <label>Professional notes (internal only)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, minHeight: 56, resize: "vertical" }} placeholder="Internal notes — never shown to customers" />
          </div>

          <div className="field">
            <label>Review status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
              <option value="UNREVIEWED">Unreviewed</option>
              <option value="REVIEW_REQUIRED">Review Required</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </div>
          <div className="field">
            <label>Data source / evidence</label>
            <input value={source} onChange={(e) => setSource(e.target.value)} style={inputStyle} placeholder="e.g. Ingredient identity — essential oil" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            className="btn btn-moss"
            style={{ flex: 1 }}
            disabled={saving}
            onClick={() => onSave({
              category: cat || "Unclassified",
              inci_name: inci || null,
              essential_oil: eo,
              bee_derived: bee,
              nut_derived: nut,
              seed_derived: seed,
              coconut_derived: coconut,
              dairy_derived: dairy,
              latex_related: latex,
              fragrance_relevant: fragrance,
              sensitivity_relevant: isSensitive,
              sensitivity_categories: cats,
              customer_warning: warning || null,
              professional_notes: notes || null,
              allergy_data_status: status,
              allergy_data_source: source || null,
            })}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button className="btn btn-line" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ALLERGY DATA PANEL — quality dashboard + product completeness
// =============================================================================

function AllergyDataPanel() {
  const stats = getIngredientStats();
  const products = getActiveProducts();
  const productProfiles = products.map((p) => ({
    product: p,
    profile: getProductAllergyProfile(p),
  }));
  const complete = productProfiles.filter((pp) => pp.profile.reviewStatus === "COMPLETE").length;
  const incomplete = productProfiles.filter((pp) => pp.profile.reviewStatus === "INCOMPLETE").length;

  return (
    <>
      {/* Stats grid */}
      <div className="statgrid">
        <div className="stat">
          <div className="lbl">INGREDIENTS</div>
          <div className="val">{stats.total}</div>
          <div className="sub-text">total in registry</div>
        </div>
        <div className="stat">
          <div className="lbl">VERIFIED</div>
          <div className="val" style={{ color: "#22C55E" }}>{stats.verified}</div>
          <div className="sub-text">allergy data reviewed</div>
        </div>
        <div className="stat">
          <div className="lbl">UNREVIEWED</div>
          <div className="val" style={{ color: "#9CA3AF" }}>{stats.unreviewed}</div>
          <div className="sub-text">awaiting review</div>
        </div>
        <div className="stat">
          <div className="lbl">PRODUCTS COMPLETE</div>
          <div className="val" style={{ color: "#22C55E" }}>{complete}</div>
          <div className="sub-text">all ingredients verified</div>
        </div>
        <div className="stat">
          <div className="lbl">PRODUCTS INCOMPLETE</div>
          <div className="val" style={{ color: "#F59E0B" }}>{incomplete}</div>
          <div className="sub-text">some ingredients unreviewed</div>
        </div>
      </div>

      {/* Product allergy completeness */}
      <div className="panel">
        <div className="phead">
          <h3>Product Allergy Data Completeness</h3>
        </div>
        <div className="table-scroll">
          <table className="adm">
            <thead>
              <tr>
                <th>Product</th>
                <th>Ingredients</th>
                <th>Verified</th>
                <th>Unreviewed</th>
                <th>EO</th>
                <th>Bee</th>
                <th>Nut/Seed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {productProfiles.map(({ product: p, profile }) => (
                <tr key={p.id}>
                  <td><b>{p.name}</b></td>
                  <td>{profile.totalCount}</td>
                  <td style={{ color: "#22C55E" }}>{profile.verifiedCount}</td>
                  <td style={{ color: profile.unreviewedCount > 0 ? "#F59E0B" : "#22C55E" }}>
                    {profile.unreviewedCount}
                  </td>
                  <td>{profile.hasEssentialOils ? "Yes" : "—"}</td>
                  <td>{profile.hasBeeDerived ? "Yes" : "—"}</td>
                  <td>{profile.hasNutDerived || profile.hasSeedDerived ? "Yes" : "—"}</td>
                  <td>
                    <span className="pill" style={{
                      background: profile.reviewStatus === "COMPLETE" ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
                      color: profile.reviewStatus === "COMPLETE" ? "#22C55E" : "#F59E0B",
                    }}>
                      {profile.reviewStatus === "COMPLETE" ? "Complete" : "Incomplete"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unreviewed ingredients list */}
      {stats.unreviewed > 0 && (
        <div className="panel">
          <div className="phead">
            <h3>Ingredients Requiring Review ({stats.unreviewed})</h3>
          </div>
          <div style={{ padding: "14px 20px", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {getAllIngredients()
              .filter((i) => i.allergyDataStatus === "UNREVIEWED")
              .map((i) => (
                <span key={i.name} style={{
                  fontSize: 12, padding: "4px 10px", borderRadius: 999,
                  background: "rgba(0,0,0,0.04)", color: "var(--ink)",
                }}>
                  {i.name}
                </span>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

// =============================================================================
// DB ORDERS PANEL — Supabase-backed orders with status management
// =============================================================================

function DbOrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  useState(() => { fetchOrders(); });

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
  const formatMoney = (cents: number) => "£" + (cents / 100).toFixed(2);

  return (
    <div className="panel">
      <div className="phead">
        <h3>Orders ({orders.length})</h3>
        <button onClick={fetchOrders} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--paper)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Refresh</button>
      </div>
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty" style={{ padding: 50 }}>
          <div className="serif">No orders yet</div>
          <p>Orders placed through checkout will appear here.</p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="adm">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td>
                    <b>{o.order_number}</b><br />
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>{formatDate(o.created_at)}</span>
                  </td>
                  <td>
                    {o.delivery_name || o.customers?.name || "—"}<br />
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>{o.delivery_email || o.customers?.email || ""}</span>
                  </td>
                  <td style={{ fontSize: 13 }}>
                    {(o.order_items || []).map((item: any, i: number) => (
                      <span key={i}>{item.quantity}× {item.product_name}{i < o.order_items.length - 1 && <br />}</span>
                    ))}
                  </td>
                  <td><b>{formatMoney(o.total_cents)}</b></td>
                  <td><span className={`pill ${o.status}`}>{o.status}</span></td>
                  <td>
                    <div className="rowact">
                      <select defaultValue={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                        {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// CUSTOMERS PANEL — Supabase-backed customer directory + purchase history
// =============================================================================

function CustomersPanel() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data.customers || []);
    setLoading(false);
  };

  useState(() => { fetchCustomers(); });

  const viewCustomer = async (c: any) => {
    setSelectedCustomer(c);
    const res = await fetch(`/api/orders?customerId=${c.id}`);
    const data = await res.json();
    setCustomerOrders(data.orders || []);
  };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const formatMoney = (cents: number) => "£" + ((cents || 0) / 100).toFixed(2);

  return (
    <>
      <div className="panel">
        <div className="phead">
          <h3>Customers ({customers.length})</h3>
          <button onClick={fetchCustomers} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--paper)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Refresh</button>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="empty" style={{ padding: 50 }}>
            <div className="serif">No customers yet</div>
            <p>Customer records are created automatically when orders are placed.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="adm">
              <thead>
                <tr><th>Customer</th><th>Email</th><th>Location</th><th>Orders</th><th>Total Spent</th><th>Last Order</th><th></th></tr>
              </thead>
              <tbody>
                {customers.map((c: any) => (
                  <tr key={c.id}>
                    <td><b>{c.name}</b></td>
                    <td style={{ fontSize: 13 }}>{c.email}</td>
                    <td style={{ fontSize: 13, color: "var(--muted)" }}>{[c.city, c.country].filter(Boolean).join(", ") || "—"}</td>
                    <td>{c.order_count}</td>
                    <td>{formatMoney(c.total_spent_cents)}</td>
                    <td style={{ fontSize: 12, color: "var(--muted)" }}>{formatDate(c.last_order_at)}</td>
                    <td>
                      <button onClick={() => viewCustomer(c)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--line)", background: "var(--paper)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <div className="panel" style={{ marginTop: 16 }}>
          <div className="phead">
            <h3>{selectedCustomer.name}</h3>
            <button onClick={() => setSelectedCustomer(null)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid var(--line)", background: "var(--paper)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Close</button>
          </div>
          <div style={{ padding: "14px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16, fontSize: 14 }}>
              <div><span style={{ fontSize: 12, color: "var(--muted)", display: "block" }}>Email</span>{selectedCustomer.email}</div>
              <div><span style={{ fontSize: 12, color: "var(--muted)", display: "block" }}>Location</span>{[selectedCustomer.city, selectedCustomer.country].filter(Boolean).join(", ") || "—"}</div>
              <div><span style={{ fontSize: 12, color: "var(--muted)", display: "block" }}>Customer since</span>{formatDate(selectedCustomer.created_at)}</div>
            </div>
            <h4 style={{ fontSize: 14, marginBottom: 8 }}>Order History ({customerOrders.length})</h4>
            {customerOrders.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: 13 }}>No orders found.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {customerOrders.map((o: any) => (
                  <div key={o.id} style={{ background: "var(--paper-2)", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <b style={{ fontSize: 13 }}>{o.order_number}</b>
                      <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 8 }}>{formatDate(o.created_at)}</span>
                      <br />
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        {(o.order_items || []).map((i: any) => `${i.quantity}× ${i.product_name}`).join(", ")}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <b>{formatMoney(o.total_cents)}</b><br />
                      <span className={`pill ${o.status}`} style={{ fontSize: 11 }}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
