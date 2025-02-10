import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategories } from "@/api/categories";
import { Button } from "@/components/ui/button";

import { CategoryForm } from "./components/category-form";
import { MenuItemForm } from "./components/menu-item-form";

export default async function AdminPage() {
  const { categories } = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administração</h1>
        <p className="text-muted-foreground">
          Gerencie as categorias e itens do seu cardápio
        </p>
      </div>
      <Link href="/admin/myproducts">
        <Button>Meus Produtos</Button>
      </Link>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="items">Itens</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="space-y-4">
          <CategoryForm />
        </TabsContent>
        <TabsContent value="items" className="space-y-4">
          <MenuItemForm categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
