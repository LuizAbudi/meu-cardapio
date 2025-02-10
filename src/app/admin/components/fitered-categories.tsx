"use client";

import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/menu";

import { deleteCategory } from "../actions";

interface FilteredCategoriesProps {
  initialCategories: Category[];
}

export default function FilteredCategories({
  initialCategories,
}: FilteredCategoriesProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleDelete(id: string) {
    setIsLoading(id);
    try {
      const result = await deleteCategory(id);
      if (result.success) {
        toast({
          title: "Categoria deletada",
          description: "A categoria foi deletada com sucesso.",
        });
        setCategories((prev) => prev.filter((category) => category.id !== id));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar categoria.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  }

  // async function handleUpdate(id: string, formData: FormData) {
  //   try {
  //     const result = await updateCategory(id, formData)
  //     if (result.success) {
  //       toast({
  //         title: "Categoria atualizada",
  //         description: "A categoria foi atualizada com sucesso.",
  //       })
  //       setCategories((prev) =>
  //         prev.map((category) =>
  //           category.id === id ? { ...category, ...result.data } : category
  //         )
  //       )
  //     } else {
  //       throw new Error(result.error)
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Erro",
  //       description: "Erro ao atualizar categoria.",
  //       variant: "destructive",
  //     })
  //     console.error(error)
  //   }
  // }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 py-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquise por nome da categoria"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="relative h-48">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                ) : null}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                        disabled={isLoading === category.id}
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

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma categoria encontrada
            </p>
          </div>
        )}

        {/* Criar modal para editar categoria */}
      </div>
    </div>
  );
}
