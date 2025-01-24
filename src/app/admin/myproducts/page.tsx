import { getCategories } from "@/api/categories"
import { getAllMenuItens } from "@/api/menuItems"
import { MenuItem } from "@/types/menu"
import FilteredProducts from '../components/filtered-products'
import FilteredCategories from '../components/fitered-categories'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function MyProducts() {
  const { categories } = await getCategories()
  const { items } = await getAllMenuItens()

  const newItems: MenuItem[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    halfPrice: item.halfPrice || 0,
    image: item.image,
    category: item.category.name,
    promotion: item.promotion
      ? {
        price: item.promotion.price,
        inPromotion: item.promotion.inPromotion,
      }
      : undefined,
  }))

  return (
    <>
      <Link href="/admin" className="position-absolute top-0 left-0">
        <Button>Voltar</Button>
      </Link>
      <div className="min-h-screen bg-background flex justify-center">
        <div className="py-8">
          <div className="container">
            <Tabs defaultValue="products">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="products">Produtos</TabsTrigger>
                <TabsTrigger value="categories">Categorias</TabsTrigger>
              </TabsList>
              <TabsContent value="categories">
                <h1 className="text-3xl font-bold tracking-tight mb-4">Meus Produtos</h1>
                <FilteredCategories initialCategories={categories} />
              </TabsContent>
              <TabsContent value="products">
                <h1 className="text-3xl font-bold tracking-tight mb-4">Meus Produtos</h1>
                <FilteredProducts initialItems={newItems} categories={categories} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>

  )
}