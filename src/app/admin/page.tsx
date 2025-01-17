import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryForm } from "./components/category-form"
import { MenuItemForm } from "./components/menu-item-form"
import { CategoriesList } from "./components/categories-list"
import { MenuItemsList } from "./components/menu-items-list"
import { getAdminData } from './actions'

export default async function AdminPage() {
  const { categories, items } = await getAdminData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Administração</h1>
        <p className="text-muted-foreground">
          Gerencie as categorias e itens do seu cardápio
        </p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="items">Itens</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="space-y-4">
          <CategoryForm />
          <CategoriesList categories={categories} />
        </TabsContent>
        <TabsContent value="items" className="space-y-4">
          <MenuItemForm categories={categories} />
          <MenuItemsList items={items} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

