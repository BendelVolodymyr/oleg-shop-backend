import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleMongooseError } from '../helpers/handleMongooseError.js';

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // Ціна береться з продукту
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

export const newCartSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(), // ObjectId користувача
  productId: Joi.string().hex().length(24).required(), // ObjectId товару
  quantity: Joi.number().integer().min(1).required(), // Мінімальна кількість = 1
  price: Joi.number().positive().required(), // Ціна має бути позитивною
});

cartSchema.post('save', handleMongooseError);

export const Cart = model('cart', cartSchema);
