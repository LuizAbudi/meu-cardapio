import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getCategory } from "@/api/categories";
import { getMenuItems } from "@/api/menuItems";
import { MenuItemCard } from "@/components/menu-item-card";
import Loading from "@/components/loading";
import { veryfyConnectionMongo } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchData(categoryId: string) {
  await veryfyConnectionMongo();
  const category = await getCategory(categoryId);
  const { items } = await getMenuItems(categoryId);
  return { category, items };
}

export default async function CategoryPage({ params }: Props) {
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
      {items.length === 0 && (
        <div className="flex justify-center h-full">
          <p className="text-center text-xl font-semibold">
            Não há produtos disponíveis nesta categoria.
          </p>
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
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
        ))}
      </div>
    </>
  );
}
