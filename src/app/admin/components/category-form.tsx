'use client'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createCategory } from "../actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useCallback, useRef, useState } from 'react'
import { MdOutlineFileUpload } from "react-icons/md";

const categorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  image: z.string().url("Insira uma URL válida para a imagem"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export function CategoryForm() {
  const { toast } = useToast()
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
    },
  })
  const [isImageUrl, setIsImageUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(async (values: CategoryFormValues) => {
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
  }, [form, toast]);

  const handleCheckedChange = useCallback(() => {
    setIsImageUrl(prev => !prev);
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
          if (typeof e.target?.result === 'string') {
            form.setValue('image', e.target.result);
          }
        }
        reader.readAsDataURL(file);
      }
    }
  }, [form]);

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
                    <Input className="bg-white" placeholder="Digite o nome da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Switch id="image-url" checked={isImageUrl} onCheckedChange={handleCheckedChange} />
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
                        <Button variant="secondary" type="button" onClick={handleFileChange}>
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
                      <Input className="bg-white" placeholder="https://exemplo.com/imagem.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Criando..." : "Criar Categoria"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
