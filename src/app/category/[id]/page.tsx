import { notFound } from "next/navigation";

import { getCategory } from "@/api/categories";
import { getMenuItems } from "@/api/menuItems";
import { MenuItemCard } from "@/components/menu-item-card";
import { connectToMongoDB } from "@/lib/db";

import { PageProps } from "../../../../.next/types/app/page";

export default async function CategoryPage({ params }: PageProps) {
  await connectToMongoDB();

  const { id: categoryId } = await params;

  if (!categoryId) {
    notFound();
  }

  const category = await getCategory(categoryId);
  const { items } = await getMenuItems(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">{category.name}</h1>
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
