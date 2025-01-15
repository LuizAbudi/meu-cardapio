import mongoose, { Schema, Document } from 'mongoose';

interface OrderItem extends Document {
  itemName: string;
  quantity: number;
  price: number;
}

const orderItemSchema = new Schema<OrderItem>({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderItem = mongoose.models.OrderItem || mongoose.model<OrderItem>('OrderItem', orderItemSchema);

export default OrderItem;
