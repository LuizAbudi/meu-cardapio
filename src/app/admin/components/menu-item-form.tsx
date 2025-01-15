'use client'

import { createMenuItem } from "../actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  _id: string
  name: string
}

interface MenuItemFormProps {
  categories: Category[]
}

export function MenuItemForm({ categories }: MenuItemFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [categoryId, setCategoryId] = useState("")
  const { toast } = useToast()

  async function onSubmit(formData: FormData) {
    if (!categoryId) return

    setIsLoading(true)
    try {
      formData.append('categoryId', categoryId)
      const result = await createMenuItem(formData)

      if (result.success) {
        toast({
          title: "Item criado",
          description: "O item foi criado com sucesso",
        })
        // Reset form
        const form = document.getElementById('menuItemForm') as HTMLFormElement
        form.reset()
        setCategoryId("")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar item",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Item</CardTitle>
        <CardDescription>Adicione um novo item ao cardápio</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="menuItemForm" action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">URL da Imagem</Label>
            <Input id="image" name="image" type="url" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading || !categoryId}>
            {isLoading ? "Criando..." : "Criar Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

