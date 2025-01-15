import { MenuItemCard } from "@/components/menu-item-card"
import { connectToMongoDB } from "@/lib/db"
import { Category } from "@/models/Category"
import { MenuItem } from "@/models/MenuItem"
import { notFound } from "next/navigation"

export default async function CategoryPage({ params }: { params: { id: string } }) {
  await connectToMongoDB()

  const category = await Category.findById(params.id).lean()
  if (!category || Array.isArray(category)) {
    notFound()
  }

  const items = await MenuItem.find({ category: params.id }).lean()

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">{category.name}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard
            key={item._id.toString()}
            item={{
              id: item._id.toString(),
              name: item.name,
              description: item.description,
              price: item.price,
              image: item.image || "/placeholder.svg?height=200&width=300",
              category: params.id,
              promotion: item.promotion || false
            }}
          />
        ))}
      </div>
    </>
  )
}

