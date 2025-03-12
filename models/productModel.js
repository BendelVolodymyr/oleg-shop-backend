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
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    variants: [
      {
        sku: { type: String, required: true, unique: true },
        color: { type: String, trim: true },
        size: { type: String, trim: true },
        stock: { type: Number, default: 0, min: 0 },
      },
    ],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    availability: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'pre_order'],
      default: 'in_stock',
    },
    adminName: { type: String, trim: true },
    role: { type: String, trim: true },
    metaTitle: {
      type: String, // Мета-заголовок
      trim: true,
      default: '',
    },
    metaDescription: {
      type: String, // Мета-опис
      trim: true,
      default: '',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Product = model('Product', productSchema);
