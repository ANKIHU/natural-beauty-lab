"use client";

import { useState, useCallback } from "react";
import { money, FREE_SHIPPING_THRESHOLD, CATEGORIES, type Product, getActiveProducts } from "@/lib/products";
import { adminStore, type Order } from "@/lib/admin-store";
import { BrandMark, CloseIcon } from "@/components/Icons";
import { getIngredientStats, getAllIngredients, type IngredientRecord, type AllergyDataStatus } from "@/lib/ingredients";
import { getProductAllergyProfile } from "@/lib/allergy-aware";
import Image from "next/image";

const ADMIN_PASSWORD = "nbl2026";

type Tab = "dashboard" | "products" | "orders" | "ingredients" | "allergy-data";

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
            {(["dashboard", "products", "orders", "ingredients", "allergy-data"] as Tab[]).map((t) => (
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
          {tab === "orders" && <OrdersPanel rerender={rerender} />}
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
// INGREDIENTS PANEL — allergy metadata editor
// =============================================================================

function IngredientsPanel() {
  const [filter, setFilter] = useState<"all" | AllergyDataStatus>("all");
  const ingredients = getAllIngredients();
  const filtered = filter === "all"
    ? ingredients
    : ingredients.filter((i) => i.allergyDataStatus === filter);

  const statusColor = (s: AllergyDataStatus) =>
    s === "VERIFIED" ? "#22C55E" : s === "REVIEW_REQUIRED" ? "#F59E0B" : "#9CA3AF";
  const statusBg = (s: AllergyDataStatus) =>
    s === "VERIFIED" ? "rgba(34,197,94,0.08)" : s === "REVIEW_REQUIRED" ? "rgba(245,158,11,0.08)" : "rgba(0,0,0,0.03)";

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
                {f === "all" ? "All" : f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
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
                <th>Fragrance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ing) => (
                <tr key={ing.name}>
                  <td>
                    <b>{ing.name}</b>
                    {ing.inciName && <br />}
                    {ing.inciName && <span style={{ color: "var(--muted)", fontSize: 12, fontStyle: "italic" }}>{ing.inciName}</span>}
                  </td>
                  <td style={{ fontSize: 12 }}>{ing.category}</td>
                  <td>{ing.essentialOil ? "●" : "—"}</td>
                  <td>{ing.beeDerived ? "●" : "—"}</td>
                  <td>{ing.nutDerived ? "●" : "—"}</td>
                  <td>{ing.seedDerived ? "●" : "—"}</td>
                  <td>{ing.coconutDerived ? "●" : "—"}</td>
                  <td>{ing.dairyDerived ? "●" : "—"}</td>
                  <td>{ing.fragranceRelevant ? "●" : "—"}</td>
                  <td>
                    <span className="pill" style={{
                      background: statusBg(ing.allergyDataStatus),
                      color: statusColor(ing.allergyDataStatus),
                    }}>
                      {ing.allergyDataStatus === "VERIFIED" ? "Verified" : ing.allergyDataStatus === "REVIEW_REQUIRED" ? "Review" : "Unreviewed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
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
