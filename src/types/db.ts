import { ObjectId } from "mongodb";

export interface Category {
  _id: ObjectId;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  halfPrice: number;
  image?: string;
  categoryId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  promotion?: {
    promotionPrice: number;
    inPromotion: boolean;
  };
}

export interface Order {
  _id: ObjectId;
  items: OrderItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
  halfPrice: number;
}
