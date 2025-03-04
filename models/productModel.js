import { model, Schema } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    images: {
      type: [String],
      default: [],
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
