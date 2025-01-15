export interface CategoryFormData {
  name: string
  image?: string
}

export interface MenuItemFormData {
  name: string
  description: string
  price: number
  image?: string
  categoryId: string
}
