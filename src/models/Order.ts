import mongoose, { Document, Schema } from "mongoose";

import OrderItem from "./OrderItem";

interface Order extends Document {
  items: OrderItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<Order>({
  items: [{ type: Schema.Types.ObjectId, ref: "OrderItem", required: true }],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order =
  mongoose.models.Order || mongoose.model<Order>("Order", orderSchema);

export default Order;
