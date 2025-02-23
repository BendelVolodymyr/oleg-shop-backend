import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleMongooseError } from '../middlewares/handleMongooseError.js';

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // Посилання на користувача
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        }, // Посилання на продукт
        quantity: { type: Number, required: true, min: 1 }, // Кількість товару
        price: { type: Number, required: true }, // Ціна за одиницю
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 }, // Загальна сума
  },
  { versionKey: false, timestamps: true }
);

export const newCartSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(), // ObjectId користувача
  productId: Joi.string().hex().length(24).required(), // ObjectId товару
  quantity: Joi.number().integer().min(1).required(), // Мінімальна кількість = 1
  price: Joi.number().positive().required(), // Ціна має бути позитивною
});

userSchema.post('save', handleMongooseError);

export const Cart = model('cart', cartSchema);
