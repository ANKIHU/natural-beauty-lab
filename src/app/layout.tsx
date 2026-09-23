import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Toast } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Nature's Beauty Lab — Natural Skincare, Handmade in Small Batches",
  description: "Twenty-seven small-batch formulations for skin, body and hair — built on raw honey, botanicals and three generations of herbalist wisdom.",
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
