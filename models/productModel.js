import { model, Schema } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category', // Якщо є окрема колекція категорій
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    adminName: { type: String, trim: true },
    role: { type: String, trim: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Product = model('Product', productSchema);
