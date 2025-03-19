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
        sku: { type: String, required: true }, // Видалено `unique`, щоб уникнути конфліктів
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
    adminName: { type: String, trim: true, default: null },
    role: { type: String, trim: true, default: null },
    seo: {
      metaTitle: { type: String, trim: true, default: '', maxlength: 60 }, // Обмеження довжини
      metaDescription: {
        type: String,
        trim: true,
        default: '',
        maxlength: 160,
      },
      metaKeywords: { type: [String], default: [] },
      metaH1: { type: String, trim: true, default: '', maxlength: 70 },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Product = model('Product', productSchema);

export default { Product };
