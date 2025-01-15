import { whiteLabelConfig } from "@/config/white-label"
import { Cart } from "@/components/cart"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-10">
      <div className="container flex items-center justify-between h-full min-w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={whiteLabelConfig.logo || "/placeholder.svg"}
            alt={whiteLabelConfig.restaurantName}
            width={80}
            height={80}
            className="rounded-full m-2"
          />
          <span className="text-xl font-bold">{whiteLabelConfig.restaurantName}</span>
        </Link>
        <div className="flex mr-4">
          <Cart />
        </div>
      </div>
    </header>
  )
}
