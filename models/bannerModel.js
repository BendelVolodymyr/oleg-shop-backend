import Joi from 'joi';
import { Schema, model } from 'mongoose';

const bannerFieldConfig = {
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(3).max(500),
  link: Joi.string().uri(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')),
  isActive: Joi.boolean(),
  altImg: Joi.string().allow(''),
  urlImg: Joi.string().uri().allow(''),
  urlId: Joi.string().trim().allow(''),
  adminName: Joi.string().trim(),
  role: Joi.string().trim(),
  displayOrder: Joi.number().integer().min(1),
  type: Joi.string().valid('promotion', 'advertisement', 'announcement'),
  folderType: Joi.string().valid('banners'),
};

const makeSchema = (fields, requiredFields = []) => {
  const shape = {};
  for (const key in fields) {
    shape[key] = requiredFields.includes(key)
      ? fields[key].required()
      : fields[key].optional();
  }
  return Joi.object(shape).min(1);
};

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

const createBannerSchema = makeSchema(bannerFieldConfig, [
  'title',
  'description',
  'link',
  'startDate',
  'endDate',
  'isActive',
  'type',
]);

const preCloudinaryUpdateSchema = makeSchema(
  // без полів, які додає Cloudinary
  Object.fromEntries(
    Object.entries(bannerFieldConfig).filter(
      ([key]) => !['urlImg', 'urlId', 'folderType'].includes(key)
    )
  )
);

const updateBannerSchema = makeSchema(bannerFieldConfig);

export const joiBannerSchema = {
  createBannerSchema,
  preCloudinaryUpdateSchema,
  updateBannerSchema,
};

export const Banner = model('banner', bannerSchema);
