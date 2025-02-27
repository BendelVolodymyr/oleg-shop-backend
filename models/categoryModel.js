import Joi from 'joi';
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
  },
  { versionKey: false, timestamps: true }
);

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

categorySchema.post('save', handleMongooseError);

export const validCategorySchema = {
  createCategorySchema,
};

export const Category = model('category', categorySchema);
