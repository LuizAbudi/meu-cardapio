import zlib from "zlib";

import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getCategory } from "@/api/categories";
import { getMenuItems } from "@/api/menuItems";
import { MenuItemCard } from "@/components/menu-item-card";
import { connectToMongoDB } from "@/lib/db";
import Loading from "@/components/loading";

type Props = {
  params: Promise<{ id: string }>;
};

type MenuItemType = {
  id: string;
  name: string;
  description: string;
  price: number;
  halfPrice: number;
  image: string;
  category: string;
  promotion?: {
    price: number | null;
    inPromotion: boolean;
  };
};

async function fetchData(categoryId: string) {
  await connectToMongoDB();
  const category = await getCategory(categoryId);

  const { compressedData } = await getMenuItems(categoryId);

  const responseSizeKB = Buffer.byteLength(compressedData, "base64") / 1024;
  console.log(
    `📦 Tamanho da resposta comprimida: ${responseSizeKB.toFixed(2)} KB`,
  );

  const jsonString = zlib
    .gunzipSync(Buffer.from(compressedData, "base64"))
    .toString();

  const responseSizeUncompressedKB =
    Buffer.byteLength(jsonString, "utf-8") / 1024;
  console.log(
    `📦 Tamanho da resposta descomprimida: ${responseSizeUncompressedKB.toFixed(2)} KB`,
  );

  return {
    category,
    items: JSON.parse(jsonString).items as MenuItemType[],
  };
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
              promotion: item.promotion
                ? {
                    price: item.promotion.price ?? 0,
                    inPromotion: item.promotion.inPromotion,
                  }
                : undefined,
            }}
            categoryName={category.name}
          />
        ))}
      </div>
    </>
  );
}
