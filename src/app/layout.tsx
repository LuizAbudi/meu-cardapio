import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Header } from "@/components/header";
import { CartProvider } from "@/contexts/cart-context";
import { whiteLabelConfig } from "@/config/white-label";
import { connectToMongoDB } from "@/lib/db";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: whiteLabelConfig.restaurantName,
  description: `Cardápio digital - ${whiteLabelConfig.restaurantName}`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  connectToMongoDB();
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <main className="flex-grow m-4">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
