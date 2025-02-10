import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    halfPrice: { type: Number, required: true },
    image: { type: String },
    promotion: {
      inPromotion: { type: Boolean, required: true, default: false },
      price: {
        type: Number,
        required: function (this: { promotion: { inPromotion: boolean } }) {
          return this.promotion.inPromotion;
        },
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const MenuItem =
  mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);
