import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Toast } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Nature's Beauty Lab — Formulation-Led Skincare, Haircare &amp; Body Care",
  description: "Botanical oils, extracts, clays and modern cosmetic ingredients — selected for a purpose, developed with formulation science, produced in small batches.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <Toast />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
