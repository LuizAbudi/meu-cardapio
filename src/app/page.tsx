import { getCategories } from '@/api/categories'
import { CategoryCard } from "@/components/category-card"
import { connectToMongoDB } from '@/lib/db'

// const categories = [
//   {
//     id: "1",
//     name: "Porções",
//     image: "/categories/porcoes.jpg",
//   },
//   {
//     id: "2",
//     name: "Bebidas",
//     image: "/categories/bebidas.jpg",
//   },
//   {
//     id: "3",
//     name: "Drinks",
//     image: "/categories/drinks.jpg",
//   },
//   {
//     id: "4",
//     name: "Doses",
//     image: "/categories/doses.jpg",
//   },
//   {
//     id: "5",
//     name: "Combos",
//     image: "/categories/combos.jpg",
//   },
//   {
//     id: "6",
//     name: "Promoções",
//     image: "/categories/promocoes.jpg",
//   },
// ]

export default async function Home() {
  await connectToMongoDB()
  const { categories } = await getCategories();

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Cardápio Digital</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={{
              id: category.id,
              name: category.name,
              image: category.image
            }}
          />
        ))}
      </div>
    </>
  )
}
