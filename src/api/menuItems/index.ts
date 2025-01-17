import { connectToMongoDB } from '@/lib/db';
import { MenuItem } from '@/models/MenuItem';

export async function getMenuItems(categoryId: string) {
  await connectToMongoDB();

  const items = await MenuItem.find({ category: categoryId }).lean();

  return {
    items: items.map((item) => ({
      id: String(item._id),
      name: item.name,
      description: item.description,
      price: item.price / 100,
      image: item.image || "/placeholder.svg?height=200&width=300",
      category: categoryId,
      promotion: item.promotion || false
    })),
  }
}

export async function getAllMenuItens() {
  const items = await MenuItem.find().populate('category').sort({ name: 1 }).lean()

  return {
     items: items.map((item) => ({
      _id: String(item._id),
      id: String(item._id),
      name: item.name,
      description: item.description,
      price: item.price,
      createdAt: item.createdAt.toISOString(),
      category: {
        name: item.category.name,
      },
      promotion: item.promotion
        ? {
            price: item.promotion.price,
            inPromotion: item.promotion.inPromotion,
          }
        : undefined,
    })),
  };
}
  