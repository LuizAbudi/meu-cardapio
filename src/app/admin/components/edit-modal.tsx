"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, MenuItem } from "@/types/menu";
import { formatCurrencyInput } from "@/utils/format";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface EditModalProps {
  item: MenuItem | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, formData: FormData) => Promise<void>;
}

interface HandleChangeProps {
  e: React.ChangeEvent<HTMLInputElement>;
  field: {
    onChange: (value: number) => void;
  };
}

const menuItemSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  price: z
    .number({ invalid_type_error: "O preço deve ser um número" })
    .positive("O preço deve ser maior que zero"),
  halfPrice: z
    .number({
      invalid_type_error: "O preço da meia porção deve ser um número",
    })
    .optional(),
  image: z.string().url("Insira uma URL válida para a imagem"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  promotion: z.object({
    promotionPrice: z.number().optional(),
    inPromotion: z.boolean(),
  }),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export function EditModal({
  item,
  categories,
  isOpen,
  onClose,
  onSave,
}: EditModalProps) {
  const [isPromotion, setIsPromotion] = useState<boolean>(
    item?.promotion?.inPromotion ?? false,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [halfPrice, setHalfPrice] = useState(false);

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    values: {
      name: item?.name || "",
      description: item?.description || "",
      price: (item?.price ?? 0) * 100,
      halfPrice: (item?.halfPrice ?? 0) * 100,
      image: item?.image || "",
      promotion: {
        promotionPrice: (item?.promotion?.promotionPrice ?? 0) * 100 || 0,
        inPromotion: item?.promotion?.inPromotion || false,
      },
      categoryId:
        categories.find((cat) => cat.name === item?.category)?.id || "",
    },
  });

  const handleCheckedPromotion = useCallback(() => {
    setIsPromotion((prev) => !prev);
  }, []);

  const onSubmit = async (data: MenuItemFormValues) => {
    if (!item) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("halfPrice", data.halfPrice?.toString() || "");
      formData.append("image", data.image);
      formData.append("categoryId", data.categoryId);

      if (data.promotion.inPromotion && data.promotion.promotionPrice) {
        formData.append(
          "promotion.promotionPrice",
          data.promotion.promotionPrice.toString(),
        );
        formData.append(
          "promotion.inPromotion",
          data.promotion.inPromotion.toString(),
        );
      }

      await onSave(item.id, formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyHalfPrice = useCallback((categoryName: string) => {
    if (categoryName === "Porções") {
      setHalfPrice(true);
    } else {
      setHalfPrice(false);
    }
  }, []);

  useEffect(() => {
    const categoryName = categories.find(
      (cat) => cat.id === form.getValues("categoryId"),
    )?.name;
    if (categoryName) {
      verifyHalfPrice(categoryName);
    }
  }, [form, categories, verifyHalfPrice]);

  if (!item) return null;

  const handleChangePrice = ({ e, field }: HandleChangeProps) => {
    const formattedValue = formatCurrencyInput(e.target.value);
    const numericValue = parseFloat(formattedValue.replace(/[^0-9.]/g, ""));
    field.onChange(numericValue);
  };

  const handleValueCategoryChange = (
    value: string,
    field: {
      onChange: (value: string) => void;
    },
  ) => {
    field.onChange(value);
    verifyHalfPrice(categories.find((cat) => cat.id === value)?.name ?? "");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input className="bg-white text-black" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea className="bg-white text-black" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white text-black"
                      type="text"
                      {...field}
                      onChange={(e) => handleChangePrice({ e, field })}
                      value={formatCurrencyInput((field.value ?? 0).toString())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {item.category === "Porções" ? (
              <FormField
                control={form.control}
                name="halfPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço da Meia</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white text-black"
                        type="text"
                        {...field}
                        onChange={(e) => handleChangePrice({ e, field })}
                        value={formatCurrencyInput(
                          (field.value ?? 0).toString(),
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input className="bg-white text-black" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Esse produto está em promoção?</Label>
              <div className="mt-2">
                <Switch
                  id="isPromotion"
                  checked={isPromotion}
                  onCheckedChange={(checked) => {
                    handleCheckedPromotion();
                    form.setValue("promotion.inPromotion", checked);
                  }}
                />
              </div>
            </div>
            {isPromotion ? (
              <FormField
                control={form.control}
                name="promotion.promotionPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço da promoção</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white text-black"
                        type="text"
                        {...field}
                        onChange={(e) => handleChangePrice({ e, field })}
                        value={formatCurrencyInput(
                          (field.value ?? 0).toString(),
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        handleValueCategoryChange(value, field)
                      }
                    >
                      <SelectTrigger className="bg-white text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {halfPrice ? (
              <FormField
                control={form.control}
                name="halfPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço da meia porção</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white text-black"
                        type="text"
                        {...field}
                        onChange={(e) => {
                          const formattedValue = formatCurrencyInput(
                            e.target.value,
                          );
                          const numericValue = parseFloat(
                            formattedValue.replace(/[^0-9.]/g, ""),
                          );
                          field.onChange(numericValue);
                        }}
                        value={formatCurrencyInput(
                          (field.value ?? 0).toString(),
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
