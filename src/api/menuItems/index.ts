import { MenuItem } from "@/models/MenuItem";
import { veryfyConnectionMongo } from "@/lib/db";

export async function getMenuItems(categoryId: string) {
  await veryfyConnectionMongo();

  const items = await MenuItem.find({ category: categoryId }).lean();

  return {
    items: items.map((item) => ({
      id: String(item._id),
      name: item.name,
      description: item.description,
      price: item.price / 100,
      halfPrice: item.halfPrice / 100,
      image: item.image,
      category: categoryId,
      promotion: {
        promotionPrice: item.promotion?.promotionPrice / 100,
        inPromotion: item.promotion?.inPromotion,
      },
    })),
  };
}

export async function getAllMenuItens() {
  const items = await MenuItem.find()
    .populate("category")
    .sort({ name: 1 })
    .lean();

  return {
    items: items.map((item) => ({
      _id: String(item._id),
      id: String(item._id),
      image: item.image,
      name: item.name,
      description: item.description,
      price: item.price / 100,
      halfPrice: item.halfPrice / 100,
      createdAt: item.createdAt.toISOString(),
      category: {
        name: item.category.name,
      },
      promotion: item.promotion
        ? {
            promotionPrice: item.promotion.promotionPrice / 100,
            inPromotion: item.promotion.inPromotion,
          }
        : undefined,
    })),
  };
}
