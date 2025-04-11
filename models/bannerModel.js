import Joi from 'joi';
import { Schema, model } from 'mongoose';

const bannerSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    altImg: { type: String, default: '' },
    urlImg: { type: String, default: '' },
    urlId: { type: String, default: '' },
    adminName: { type: String, trim: true },
    role: { type: String, trim: true },
    displayOrder: { type: Number, required: true, min: 1 },
    type: { type: String, default: 'promotion' },
  },
  { versionKey: false }
);

const updateBannerSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(3).max(500).optional(),
  link: Joi.string().uri().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(),
  isActive: Joi.boolean().optional(),
  altImg: Joi.string().allow('').optional(),
  urlImg: Joi.string().uri().allow('').optional(),
  urlId: Joi.string().trim().allow('').optional(),
  adminName: Joi.string().trim().optional(),
  role: Joi.string().trim().optional(),
  displayOrder: Joi.number().integer().min(1).optional(),
  type: Joi.string()
    .valid('promotion', 'advertisement', 'announcement')
    .optional(),
  folderType: Joi.string().valid('banners').optional(),
}).min(1);

export const joiBannerSchema = { updateBannerSchema };

export const Banner = model('banner', bannerSchema);
