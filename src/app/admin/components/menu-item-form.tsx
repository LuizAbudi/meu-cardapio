"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useRef, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrencyInput } from "@/utils/format";

import { createMenuItem } from "../actions";

interface Category {
  id: string;
  name: string;
}

interface MenuItemFormProps {
  categories: Category[];
}

const menuItemSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório"),
    description: z.string().min(1, "A descrição é obrigatória"),
    price: z
      .number({ invalid_type_error: "O preço deve ser um número" })
      .positive("O preço deve ser maior que zero"),
    halfPrice: z
      .number({ invalid_type_error: "O preço da meia deve ser um número" })
      .positive("O preço da meia deve ser maior que zero"),
    image: z.string().url("Insira uma URL válida para a imagem"),
    categoryId: z.string().min(1, "Selecione uma categoria"),
    promotion: z.object({
      price: z
        .number()
        .min(0, "O preço da promoção deve ser maior que zero")
        .optional(),
      inPromotion: z.boolean(),
    }),
  })
  .superRefine((data, ctx) => {
    const { price, promotion } = data;

    if (promotion.inPromotion) {
      if (promotion.price === undefined || promotion.price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["promotion", "price"],
          message: "O preço da promoção deve ser maior que zero.",
        });
      }

      if (promotion.price !== undefined && promotion.price > price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["promotion", "price"],
          message:
            "O preço da promoção não pode ser maior que o preço original.",
        });
      }
    }
  });

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export function MenuItemForm({ categories }: MenuItemFormProps) {
  const { toast } = useToast();
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      halfPrice: 0,
      image: "",
      promotion: {
        price: 0,
        inPromotion: false,
      },
      categoryId: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUrl, setIsImageUrl] = useState(false);
  const [isPromotion, setIsPromotion] = useState(false);
  const [haveHalfPrice, setHaveHalfPrice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(
    async (values: MenuItemFormValues) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price.toString());
        formData.append("halfPrice", values.halfPrice.toString());
        formData.append("image", values.image);
        formData.append("categoryId", values.categoryId);

        if (isPromotion) {
          if (values.promotion.price !== undefined) {
            formData.append(
              "promotion[price]",
              values.promotion.price.toString(),
            );
          }
          formData.append("promotion[inPromotion]", "true");
        } else {
          formData.append("promotion[inPromotion]", "false");
        }

        const result = await createMenuItem(formData);
        if (result.success) {
          toast({
            title: "Item criado",
            description: "O item foi criado com sucesso",
          });
          form.reset();
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao criar item",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, toast, isPromotion],
  );

  const handleCheckedChange = useCallback(() => {
    setIsImageUrl((prev) => !prev);
  }, []);

  const handleFileChange = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileSelection = useCallback(() => {
    if (fileInputRef.current) {
      const file = fileInputRef.current.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === "string") {
            form.setValue("image", e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [form]);

  const handleCheckedPromotion = useCallback(() => {
    setIsPromotion((prev) => !prev);
  }, []);

  const verifyHalfPrice = useCallback((category: string) => {
    if (category === "Porções") {
      setHaveHalfPrice(true);
    } else {
      setHaveHalfPrice(false);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Item</CardTitle>
        <CardDescription>Adicione um novo item ao cardápio</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Digite o nome do item"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        verifyHalfPrice(
                          categories.find((category) => category.id === value)
                            ?.name ?? "",
                        );
                      }}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione uma categoria" />
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-white"
                      placeholder="Digite a descrição do item"
                      {...field}
                    />
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
                      className="bg-white"
                      type="text"
                      placeholder="R$ 0,00"
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
                      value={formatCurrencyInput((field.value ?? 0).toString())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="image-url"
                checked={isImageUrl}
                onCheckedChange={handleCheckedChange}
              />
              <Label>Imagem via arquivo</Label>
            </div>
            {isImageUrl ? (
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Imagem</FormLabel>
                    <FormControl>
                      <div>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={handleFileChange}
                        >
                          <MdOutlineFileUpload className="h-10 w-10" />
                          <span>Upload</span>
                        </Button>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileSelection}
                        />
                        <Label className="ml-2">
                          {form.getValues("image")
                            ? "Imagem selecionada"
                            : "Nenhuma imagem selecionada"}
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="https://exemplo.com/imagem.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div>
              <Label>Esse produto está em promoção?</Label>
              <div className="mt-2">
                <Switch
                  id="isPromotion"
                  checked={isPromotion}
                  onCheckedChange={handleCheckedPromotion}
                />
              </div>
            </div>
            {isPromotion ? (
              <FormField
                control={form.control}
                name="promotion.price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço da promoção</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        type="text"
                        placeholder="R$ 0,00"
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
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            {haveHalfPrice ? (
              <FormField
                control={form.control}
                name="halfPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço da meia porção</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        type="text"
                        placeholder="R$ 0,00"
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
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Item"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
