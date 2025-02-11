"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Seu carrinho está vazio
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const price =
                  item.selectedOption === "half"
                    ? item.halfPrice
                    : item.promotion?.inPromotion
                      ? item.promotion.price
                      : item.price;
                return (
                  <div
                    key={`${item.id}-${item.selectedOption}`}
                    className="flex gap-4"
                  >
                    <div className="flex-1">
                      <p>{item.name}</p>
                      {item.selectedOption === "half" ? (
                        <p className="text-sm text-muted-foreground">
                          Meia porção
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Porção inteira
                        </p>
                      )}
                      {item.promotion?.inPromotion && (
                        <p className="text-sm text-red-500">Em promoção</p>
                      )}
                      <p className="text-sm">{formatCurrency(price)}</p>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <Button className="mt-4 w-full">Finalizar Pedido</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
