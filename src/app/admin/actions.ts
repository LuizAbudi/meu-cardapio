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
    return { success: true, data: category }
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

