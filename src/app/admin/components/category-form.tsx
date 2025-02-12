"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

import { createCategory } from "../actions";

const categorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  image: z.string().url("Insira uma URL válida para a imagem"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function CategoryForm() {
  const { toast } = useToast();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const onSubmit = useCallback(
    async (values: CategoryFormValues) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("image", values.image);

        const result = await createCategory(formData);
        if (result.success) {
          toast({
            title: "Categoria criada",
            description: "A categoria foi criada com sucesso",
          });
          form.reset();
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao criar categoria",
          variant: "destructive",
        });
        console.error(error);
      }
    },
    [form, toast],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Categoria</CardTitle>
        <CardDescription>Crie uma nova categoria no cardápio</CardDescription>
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
                      placeholder="Digite o nome da categoria"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Criando..." : "Criar Categoria"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
