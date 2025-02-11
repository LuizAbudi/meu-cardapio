import { connectToMongoDB } from "@/lib/db";
import { Category } from "@/models/Category";

export async function getCategories() {
  await connectToMongoDB();

  const categories = await Category.find().sort({ name: 1 }).lean();

  return {
    categories: categories.map((cat) => ({
      id: String(cat._id),
      name: cat.name,
      createdAt: cat.createdAt.toISOString(),
      image: cat.image,
    })),
  };
}

export async function getCategory(id: string) {
  await connectToMongoDB();

  const category = await Category.findById(id).lean();

  if (!category || Array.isArray(category)) {
    return null;
  }

  return {
    id: String(category._id),
    name: category.name,
    createdAt: category.createdAt.toISOString(),
    image: category.image,
  };
}
