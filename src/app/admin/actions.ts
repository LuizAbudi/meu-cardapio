"use server";

import { revalidatePath } from "next/cache";

import { Category } from "@/models/Category";
import { MenuItem } from "@/models/MenuItem";
import { veryfyConnectionMongo } from "@/lib/db";

export async function createCategory(formData: FormData) {
  try {
    await veryfyConnectionMongo();

    const category = await Category.create({
      name: formData.get("name"),
      image: formData.get("image") || undefined,
    });

    const simpleCategory = {
      id: String(category._id),
      name: category.name,
      createdAt: category.createdAt.toISOString(),
      image: category.image
        ? category.image.toString()
        : "/placeholder-image.jpg",
    };

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, data: simpleCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Erro ao criar categoria" };
  }
}

export async function createMenuItem(formData: FormData) {
  try {
    await veryfyConnectionMongo();

    const inPromotion = formData.get("promotion[inPromotion]") === "true";
    const promotionPrice = formData.get("promotion[promotionPrice]");

    const item = await MenuItem.create({
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      halfPrice: Number(formData.get("halfPrice")),
      image: formData.get("image") || undefined,
      category: formData.get("categoryId"),
      promotion: {
        inPromotion,
        promotionPrice: inPromotion ? Number(promotionPrice) : undefined,
      },
    });

    const simpleItem = {
      id: String(item._id),
      name: item.name,
      description: item.description,
      price: item.price / 100,
      halfPrice: item.halfPrice / 100,
      image: item.image ? item.image.toString() : "/placeholder-image.jpg",
      category: formData.get("categoryId"),
      promotion: item.promotion
        ? {
            promotionPrice: item.promotion.promotionPrice / 100,
            inPromotion: true,
          }
        : undefined,
    };

    revalidatePath("/admin");
    revalidatePath(`/category/${formData.get("categoryId")}`);
    return { success: true, data: simpleItem };
  } catch (error) {
    console.error("Error creating menu item:", error);
    return { success: false, error: "Erro ao criar item" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await veryfyConnectionMongo();

    await Promise.all([
      Category.findByIdAndDelete(id),
      MenuItem.deleteMany({ category: id }),
    ]);

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Erro ao deletar categoria" };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await veryfyConnectionMongo();
    const item = await MenuItem.findByIdAndDelete(id);

    revalidatePath("/admin");
    revalidatePath(`/category/${item?.category}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, error: "Erro ao deletar item" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    await veryfyConnectionMongo();

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: formData.get("name"),
        image: formData.get("image") || undefined,
      },
      { new: true },
    );

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Erro ao atualizar categoria" };
  }
}

export async function updateMenuItem(id: string, formData: FormData) {
  try {
    await veryfyConnectionMongo();

    const item = await MenuItem.findByIdAndUpdate(
      id,
      {
        name: formData.get("name"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        halfPrice: Number(formData.get("halfPrice")),
        image: formData.get("image") || undefined,
        category: formData.get("categoryId"),
        promotion: {
          inPromotion: formData.get("promotion[inPromotion]") === "true",
          promotionPrice: formData.get("promotion[promotionPrice]")
            ? Number(formData.get("promotion[promotionPrice]"))
            : undefined,
        },
      },
      { new: true },
    );

    const simpleItem = {
      id: String(item._id),
      name: item.name,
      description: item.description,
      price: item.price / 100,
      halfPrice: item.halfPrice / 100,
      image: item.image ? item.image.toString() : "/placeholder-image.jpg",
      category: formData.get("categoryId"),
      promotion: {
        promotionPrice: item.promotion.promotionPrice / 100,
        inPromotion: item.promotion.inPromotion,
      },
    };

    revalidatePath("/admin");
    revalidatePath(`/category/${formData.get("categoryId")}`);
    return { success: true, data: simpleItem };
  } catch (error) {
    console.error("Error updating menu item:", error);
    return { success: false, error: "Erro ao atualizar item" };
  }
}
