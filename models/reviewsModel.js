import Joi from 'joi';
import { model, Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product', // Посилання на продукт
      required: true,
    },
    user: {
      _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      email: { type: String, required: true },
    },
    comment: {
      type: String,
      required: true, // Текст коментаря
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    images: {
      type: [String], // Масив шляхів або URL зображень
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending', // Коментар буде мати статус "pending" за замовчуванням
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin', // Референс до адміністратора, який змінив статус
      default: null, // Якщо статус ще не змінювався, то null
    },
    moderatedAt: {
      type: Date,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const joiStatusSchema = Joi.object({
  status: Joi.string()
    .valid('approved', 'rejected') // Лише ці значення є допустимими
    .required(), // Поле status обов'язкове
  reviewId: Joi.string()
    .length(24) // Перевірка на правильний формат ObjectId (24 символи)
    .required(), // Поле reviewId обов'язкове
});

export const validReviews = { joiStatusSchema };

const Review = model('Review', reviewSchema);

export default { Review };
