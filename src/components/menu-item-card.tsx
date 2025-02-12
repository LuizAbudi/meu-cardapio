"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";

import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";

interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    halfPrice: number;
    image: string;
    category: string;
    promotion?: {
      price: number;
      inPromotion: boolean;
    };
  };
  categoryName: string;
}

export function MenuItemCard({ item, categoryName }: MenuItemCardProps) {
  const { addItem } = useCart();
  const [selectedOption, setSelectedOption] = useState<"full" | "half">("full");

  const handleAddToCart = () => {
    addItem({ ...item, image: "" }, categoryName, selectedOption);
  };

  if (categoryName === "Porções") {
    return (
      <Card className="overflow-hidden">
        <div className="relative h-48">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{item.name}</span>
            <div className="flex flex-col items-end">
              {item.promotion?.inPromotion ? (
                <>
                  <span className="text-sm line-through text-muted-foreground">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-primary font-bold">
                    {formatCurrency(item.promotion.price)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-primary">
                    <span className="text-base items-start">Inteira: </span>
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-primary">
                    <span className="text-base items-start">Meia: </span>
                    {formatCurrency(item.halfPrice)}
                  </span>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <div className="mt-4 flex flex-row gap-3">
            <div className="flex gap-10">
              <div className="inline-flex items-center">
                <label
                  className="relative flex items-center cursor-pointer"
                  htmlFor={`${item.id}-full`}
                >
                  <input
                    name={`${item.id}-full`}
                    type="radio"
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-primary checked:border-primary transition-all"
                    id={`${item.id}-full`}
                    checked={selectedOption === "full"}
                    onChange={() => setSelectedOption("full")}
                  />
                  <span className="absolute bg-primary w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                </label>
                <label className="ml-2 cursor-pointer text-sm" htmlFor="full">
                  Inteira
                </label>
              </div>
              <div className="inline-flex items-center">
                <label
                  className="relative flex items-center cursor-pointer"
                  htmlFor={`${item.id}-half`}
                >
                  <input
                    name={`${item.id}-half`}
                    type="radio"
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-primary checked:border-primary transition-all"
                    id={`${item.id}-half`}
                    checked={selectedOption === "half"}
                    onChange={() => setSelectedOption("half")}
                  />
                  <span className="absolute bg-primary w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                </label>
                <label className="ml-2 cursor-pointer text-sm" htmlFor="half">
                  Meia
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleAddToCart}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar ao Carrinho
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          priority
        />
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{item.name}</span>
          <div className="flex flex-col items-end">
            {item.promotion?.inPromotion ? (
              <>
                <span className="text-sm line-through text-muted-foreground">
                  {formatCurrency(item.price)}
                </span>
                <span className="text-primary font-bold">
                  {formatCurrency(item.promotion.price)}
                </span>
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
        <Button className="w-full" onClick={handleAddToCart}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}
