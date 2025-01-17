import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  promotion: { 
    price: { type: Number, required: true },
    inPromotion: { type: Boolean, required: true }
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
}, {
  timestamps: true
})

export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema)
