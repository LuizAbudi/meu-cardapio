import { ObjectId } from "mongodb"

export interface Category {
  _id: ObjectId
  name: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface MenuItem {
  _id: ObjectId
  name: string
  description: string
  price: number
  image?: string
  categoryId: ObjectId
  createdAt: Date
  updatedAt: Date
  promotion?: {
    price: number
    start: Date
    end: Date
  }
}

export interface Order {
  _id: ObjectId
  items: OrderItem[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  itemName: string
  quantity: number
  price: number
}
