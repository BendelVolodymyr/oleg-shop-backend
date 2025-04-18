import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleMongooseError } from '../helpers/handleMongooseError.js';
import { calculateTotalPrice } from '../helpers/calculateTotalPrice.js';

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      unique: true,
      sparse: true,
    },
    cartId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true }
);

const addToCartSchema = Joi.object({
  productId: Joi.string().length(24).hex().required().messages({
    'string.base': 'ID товару має бути рядком',
    'string.length': 'ID товару має бути 24 символи',
    'string.hex': 'ID товару має бути у форматі hex',
    'any.required': 'productId є обовʼязковим',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Кількість має бути числом',
    'number.integer': 'Кількість має бути цілим числом',
    'number.min': 'Мінімальна кількість — 1',
    'any.required': 'quantity є обовʼязковим',
  }),
});

cartSchema.pre('save', async function (next) {
  try {
    const total = await calculateTotalPrice(this.items);
    this.totalPrice = total;
    next();
  } catch (err) {
    next(err);
  }
});

cartSchema.post('save', handleMongooseError);

export const joiCartSchema = {
  addToCartSchema,
};

const Cart = model('cart', cartSchema);

export default { Cart };
