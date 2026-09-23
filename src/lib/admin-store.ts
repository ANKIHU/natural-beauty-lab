import { type Product, PRODUCTS, money } from "./products";

export type Order = {
  id: string;
  number: string;
  createdAt: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    note: string;
  };
  items: { id: string; name: string; price: number; qty: number }[];
  subtotal: number;
  shipping: number;
  total: number;
};

// In-memory store for admin state (persists across renders, resets on refresh)
class AdminStore {
  products: Product[];
  orders: Order[];

  constructor() {
    this.products = PRODUCTS.map((p) => ({ ...p }));
    this.orders = [];
  }

  getProducts() {
    return this.products.slice().sort((a, b) => a.order - b.order);
  }

  getActiveProducts() {
    return this.products.filter((p) => p.active).sort((a, b) => a.order - b.order);
  }

  updateProduct(id: string, patch: Partial<Product>) {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx >= 0) {
      this.products[idx] = { ...this.products[idx], ...patch };
    }
  }

  addProduct(product: Product) {
    this.products.push(product);
  }

  deleteProduct(id: string) {
    this.products = this.products.filter((p) => p.id !== id);
  }

  addOrder(order: Order) {
    this.orders.unshift(order);
  }

  updateOrderStatus(id: string, status: Order["status"]) {
    const order = this.orders.find((o) => o.id === id);
    if (order) order.status = status;
  }

  getStats() {
    const live = this.orders.filter((o) => o.status !== "cancelled");
    const revenue = live.reduce((a, o) => a + o.total, 0);
    const units = live.reduce((a, o) => a + o.items.reduce((x, i) => x + i.qty, 0), 0);
    const lowStock = this.getActiveProducts().filter((p) => p.stock < 8);

    return {
      revenue,
      orderCount: this.orders.length,
      units,
      avgOrder: live.length ? revenue / live.length : 0,
      processingCount: this.orders.filter((o) => o.status === "processing").length,
      lowStock,
    };
  }
}

export const adminStore = new AdminStore();
