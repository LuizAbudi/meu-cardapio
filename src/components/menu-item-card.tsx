'use client'

import { formatCurrency } from "@/utils/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"
import { Plus } from 'lucide-react'

interface MenuItemCardProps {
  item: {
    id: string
    name: string
    description: string
    price: number
    halfPrice: number
    image: string
    category: string
    promotion?: {
      price: number
      inPromotion: boolean
    }
  }
  categoryName: string
}

export function MenuItemCard({ item, categoryName }: MenuItemCardProps) {
  const { addItem } = useCart()

  if (categoryName === "Porções") {
    return (
      <Card className="overflow-hidden">
        <div className="relative h-48">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span className='flex items-start'>{item.name}</span>
            <div className="flex flex-col justify-end items-end">
              {item.promotion?.inPromotion ? (
                <>
                  <span className="text-sm line-through text-muted-foreground">{formatCurrency(item.price)}</span>
                  <span className="text-primary font-bold">{formatCurrency(item.promotion.price)}</span>
                </>
              ) : (
                <>
                  <span className="text-primary">
                    <span className='text-base items-start'>Inteira: </span>
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-primary">
                    <span className='text-base items-start'>Meia: </span>
                    {formatCurrency(item.halfPrice)}
                  </span>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() =>
              addItem({
                ...item,
                price: item.promotion?.inPromotion ? item.promotion.price : item.price,
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar ao Carrinho
          </Button>
        </CardFooter>
      </Card>
    )
  }


  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{item.name}</span>
          <div className="flex flex-col items-end">
            {item.promotion?.inPromotion ? (
              <>
                <span className="text-sm line-through text-muted-foreground">{formatCurrency(item.price)}</span>
                <span className="text-primary font-bold">{formatCurrency(item.promotion.price)}</span>
              </>
            ) : (
              <span className="text-primary">{formatCurrency(item.price)}</span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() =>
            addItem({
              ...item,
              price: item.promotion?.inPromotion ? item.promotion.price : item.price,
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  )
}

