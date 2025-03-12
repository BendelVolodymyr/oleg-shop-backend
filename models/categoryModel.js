import { Schema, model } from 'mongoose';
import { handleMongooseError } from '../helpers/handleMongooseError.js';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    images: {
      type: [String], // Масив рядків для зберігання URL зображень категорії
      default: [], // Якщо зображення не задано, масив буде порожнім
    },
    adminName: { type: String, trim: true },
    role: { type: String, trim: true },
  },
  { versionKey: false, timestamps: true }
);

categorySchema.post('save', handleMongooseError);

const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String], // Масив URL-адрес зображень
      default: [],
    },
    adminName: { type: String, trim: true },
    role: { type: String, trim: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

subcategorySchema.post('save', handleMongooseError);

export const Subcategory = model('Subcategory', subcategorySchema);

export const Category = model('category', categorySchema);
