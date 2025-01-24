"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Search, Trash2 } from "lucide-react"
import type { Category, MenuItem } from "@/types/menu"
import Image from "next/image"
import { deleteMenuItem, updateMenuItem } from "../actions"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditModal } from "./edit-modal"

interface FilteredProductsProps {
  initialItems: MenuItem[]
  categories: Category[]
}

export default function FilteredProducts({ initialItems, categories }: FilteredProductsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const { toast } = useToast()

  async function handleDelete(id: string) {
    setIsLoading(id)
    try {
      const result = await deleteMenuItem(id)
      if (result.success) {
        toast({
          title: "Item deletado",
          description: "O item foi deletado com sucesso",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar item",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  async function handleUpdate(id: string, formData: FormData) {
    try {
      const result = await updateMenuItem(id, formData)
      if (result.success) {
        toast({
          title: "Item atualizado",
          description: "O item foi atualizado com sucesso",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar item",
        variant: "destructive",
      })
      console.error(error)
    }
  }

  const filteredItems = initialItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === null ||
      selectedCategory === "all" ||
      item.category === categories.find((cat) => cat.id === selectedCategory)?.name
    return matchesSearch && matchesCategory
  })

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquise por nome do produto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedCategory || ""}
            onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecionar categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48">
                {item.image ? (
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                ) : null}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center justify-between space-x-2">
                    <p className="font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.price)}
                    </p>
                    <p className="font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.halfPrice)}
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        disabled={isLoading === item.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}

        <EditModal
          item={editingItem}
          categories={categories}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdate}
        />
      </div>
    </div>
  )
}

