"use client";

import { useState } from "react";
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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

export function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [showNamePhoneDialog, setShowNamePhoneDialog] = useState(false);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hasAccount, setHasAccount] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos
    let value = e.target.value.replace(/\D/g, "");

    // Aplica a máscara no número de telefone
    if (value.length <= 2) {
      value = value.replace(/(\d{2})/, "($1");
    } else if (value.length <= 7) {
      value = value.replace(/(\d{2})(\d{5})/, "($1) $2");
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    // Atualiza o estado com o valor formatado
    setPhone(value);
  };

  const handleSendToWhatsApp = () => {
    const orderDetails = items
      .map(
        (item) =>
          `${item.name} - ${formatCurrency(item.price)} x ${item.quantity}`,
      )
      .join("\n");

    const message = `
  -------------
  BAR E BOCHA
  -------------

  *Pedido:*
  ${orderDetails}

  -------------

  *Total:* ${formatCurrency(total)}

  *Nome:* ${name}
  *Telefone:* ${phone}

  *Conta no Bar e Bocha:* ${hasAccount ? "Sim" : "Não"}

  -------------

  AGUARDE A CONFIRMAÇÃO DO PEDIDO
  `;

    const whatsappUrl = `https://wa.me/55${process.env.NEXT_PUBLIC_MYPHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

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
                      {item.categoryName === "Porções" ? (
                        item.selectedOption === "half" ? (
                          <p className="text-sm text-muted-foreground">
                            Meia porção
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Porção inteira
                          </p>
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {item.categoryName}
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
                            updateQuantity(item.uniqueId, item.quantity - 1)
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
                            updateQuantity(item.uniqueId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.uniqueId)}
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
            <Button
              className="mt-4 w-full"
              onClick={() => setShowNamePhoneDialog(true)}
            >
              Finalizar Pedido
            </Button>
          </div>
        )}
      </SheetContent>

      <Dialog open={showNamePhoneDialog} onOpenChange={setShowNamePhoneDialog}>
        <DialogContent className="h-3/4">
          <DialogTitle className="text-lg font-semibold">
            Insira seus dados
          </DialogTitle>
          <div className="flex flex-col items-center justify-around space-y-4">
            <Input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Número do Celular"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={15}
            />
            <p className="mt-4">Possui conta no Bar e bocha?</p>
            <RadioGroup defaultValue="nao" className="flex gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="sim"
                  id="sim"
                  onChange={() => setHasAccount(true)}
                />
                <Label htmlFor="sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="nao"
                  id="nao"
                  onChange={() => setHasAccount(false)}
                />
                <Label htmlFor="nao">Não</Label>
              </div>
            </RadioGroup>
          </div>
          {hasAccount && (
            <Input
              placeholder="Número da conta"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          )}
          <div className="flex flex-col justify-end space-y-4">
            <Button
              onClick={() => setShowNamePhoneDialog(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setShowNamePhoneDialog(false);
                setShowOrderDetailsDialog(true);
              }}
            >
              Ok
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showOrderDetailsDialog}
        onOpenChange={setShowOrderDetailsDialog}
      >
        <DialogContent className="sm:mx-4">
          <DialogTitle className="text-lg font-semibold">
            Confirme seu pedido
          </DialogTitle>
          <p>
            {items
              .map(
                (item) =>
                  `${item.name} - ${formatCurrency(item.price)} x ${item.quantity}`,
              )
              .join("\n")}
          </p>
          <div className="flex justify-between text-lg font-medium mt-4">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="mt-4 flex justify-between">
            <Button onClick={() => setShowOrderDetailsDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                handleSendToWhatsApp();
                setShowOrderDetailsDialog(false);
              }}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
