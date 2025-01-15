import { Header } from "@/components/header"
import { CartProvider } from "@/contexts/cart-context"
import { whiteLabelConfig } from "@/config/white-label"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { connectToMongoDB } from '@/lib/db'
import "./globals.css"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: whiteLabelConfig.restaurantName,
  description: `Cardápio digital - ${whiteLabelConfig.restaurantName}`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  connectToMongoDB()
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="m-4">
              {children}
            </main>
          </div>
        </CartProvider>
      </body>
    </html>
  )
}

