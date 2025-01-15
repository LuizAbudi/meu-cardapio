'use client'

import { deleteMenuItem } from "../actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/utils/format"

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: {
    name: string
  }
  createdAt: string
}

interface MenuItemsListProps {
  items: MenuItem[]
}

export function MenuItemsList({ items }: MenuItemsListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category.name}</TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item._id)}
                  disabled={isLoading === item._id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

