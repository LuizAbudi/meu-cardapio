import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getCategory } from "@/api/categories";
import { getMenuItems } from "@/api/menuItems";
import { MenuItemCard } from "@/components/menu-item-card";
import { connectToMongoDB } from "@/lib/db";
import Loading from "@/components/loading";

import { PageProps } from "../../../../.next/types/app/category/[id]/page";

async function fetchData(categoryId: string) {
  await connectToMongoDB();
  const category = await getCategory(categoryId);
  const { items } = await getMenuItems(categoryId);
  return { category, items };
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const categoryId = resolvedParams?.id;

  if (!categoryId) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <CategoryContent categoryId={categoryId} />
    </Suspense>
  );
}

async function CategoryContent({ categoryId }: { categoryId: string }) {
  const { category, items } = await fetchData(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">{category.name}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <p className="flex justify-center h-full text-center text-xl font-semibold">
            Não há produtos disponíveis nesta categoria.
          </p>
        ) : (
          items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={{
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                halfPrice: item.halfPrice || 0,
                image: item.image,
                category: category.id,
                promotion: item.promotion || false,
              }}
              categoryName={category.name}
            />
          ))
        )}
      </div>
    </>
  );
}
