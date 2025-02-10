export interface CategoryFormData {
  name: string;
  image?: string;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  halfPrice: number;
  image?: string;
  categoryId: string;
}
