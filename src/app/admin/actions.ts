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

    const simpleCategory = {
      id: String(category._id),
      name: category.name,
      createdAt: category.createdAt.toISOString(),
      image: category.image ? category.image.toString() : "/placeholder-image.jpg",
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true, data: simpleCategory }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Erro ao criar categoria' }
  }
}

export async function createMenuItem(formData: FormData) {
  try {
    await connectToMongoDB()

    const inPromotion = formData.get("promotion[inPromotion]") === "true"
    const promotionPrice = formData.get("promotion[price]")

    const item = await MenuItem.create({
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      image: formData.get('image') || undefined,
      category: formData.get('categoryId'),
      promotion: {
        inPromotion,
        price: inPromotion ? Number(promotionPrice) : undefined,
      },
    })

    const simpleItem = {
      id: String(item._id),
      name: item.name,
      description: item.description,
      price: item.price / 100,
      image: item.image ? item.image.toString() : "/placeholder-image.jpg",
      category: formData.get('categoryId'),
      promotion: item.promotion.inPromotion ? {
        price: item.promotion.price / 100,
        inPromotion: true,
      } : undefined,
    }

    revalidatePath('/admin')
    revalidatePath(`/category/${formData.get('categoryId')}`)
    return { success: true, data: simpleItem }
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
        promotion: {
          inPromotion: formData.get("promotion[inPromotion]") === "true",
          price: formData.get("promotion[price]") ? Number(formData.get("promotion[price]")) : undefined,
        },
      }, { new: true })

    const simpleItem = {
      id: String(item._id),
      name: item.name,
      description: item.description,
      price: item.price / 100,
      image: item.image ? item.image.toString() : "/placeholder-image.jpg",
      category: formData.get('categoryId'),
      promotion: item.promotion.inPromotion ? {
        price: item.promotion.price / 100,
        inPromotion: true,
      } : undefined,
    }

    revalidatePath('/admin')
    revalidatePath(`/category/${formData.get('categoryId')}`)
    return { success: true, data: simpleItem }
  }
  catch (error) {
    console.error('Error updating menu item:', error)
    return { success: false, error: 'Erro ao atualizar item' }
  }
}


