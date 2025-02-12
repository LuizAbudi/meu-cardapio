import { Suspense } from "react";

import { getCategories } from "@/api/categories";
import { CategoryCard } from "@/components/category-card";
import Loading from "@/components/loading";
import { veryfyConnectionMongo } from "@/lib/db";

async function fetchCategories() {
  await veryfyConnectionMongo();
  const { categories } = await getCategories();
  return categories;
}

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const categories = await fetchCategories();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Cardápio Digital</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={{
              id: category.id,
              name: category.name,
              image: category.image,
            }}
          />
        ))}
      </div>
    </div>
  );
}
