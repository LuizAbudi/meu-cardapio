'use server'

import { connectToMongoDB } from "@/lib/db"
import { Category } from "@/models/Category"
import { MenuItem } from "@/models/MenuItem"
import { revalidatePath } from "next/cache"

export async function createCategory(formData: FormData) {
  try {
    await connectToMongoDB()

    const category = await Category.create({
      name: formData.get('name'),
      image: formData.get('image') || undefined,
    })

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true, data: category.toJSON() }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Erro ao criar categoria' }
  }
}

export async function createMenuItem(formData: FormData) {
  try {
    await connectToMongoDB()

    const item = await MenuItem.create({
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      image: formData.get('image') || undefined,
      category: formData.get('categoryId'),
    })

    revalidatePath('/admin')
    revalidatePath(`/category/${formData.get('categoryId')}`)
    return { success: true, data: item }
  } catch (error) {
    console.error('Error creating menu item:', error)
    return { success: false, error: 'Erro ao criar item' }
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectToMongoDB()

    await Promise.all([
      Category.findByIdAndDelete(id),
      MenuItem.deleteMany({ category: id })
    ])

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Erro ao deletar categoria' }
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await connectToMongoDB()
    const item = await MenuItem.findByIdAndDelete(id)

    revalidatePath('/admin')
    revalidatePath(`/category/${item?.category}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return { success: false, error: 'Erro ao deletar item' }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    await connectToMongoDB()

    const category = await Category.findByIdAndUpdate
      (id, {
        name: formData.get('name'),
        image: formData.get('image') || undefined,
      }, { new: true })

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true, data: category }
  }
  catch (error) {
    console.error('Error updating category:', error)
    return { success: false, error: 'Erro ao atualizar categoria' }
  }
}

export async function updateMenuItem(id: string, formData: FormData) {
  try {
    await connectToMongoDB()

    const item = await MenuItem.findByIdAndUpdate
      (id, {
        name: formData.get('name'),
        description: formData.get('description'),
        price: Number(formData.get('price')),
        image: formData.get('image') || undefined,
        category: formData.get('categoryId'),
      }, { new: true })

    revalidatePath('/admin')
    revalidatePath(`/category/${formData.get('categoryId')}`)
    return { success: true, data: item }
  }
  catch (error) {
    console.error('Error updating menu item:', error)
    return { success: false, error: 'Erro ao atualizar item' }
  }
}

export async function getAdminData() {
  await connectToMongoDB();

  const [categories, items] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    MenuItem.find().populate('category').sort({ name: 1 }).lean(),
  ]);

  return {
    categories: categories.map((cat) => ({
      id: String(cat._id),
      name: cat.name,
      createdAt: cat.createdAt.toISOString(),
    })),
    items: items.map((item) => ({
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


