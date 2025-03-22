import { Schema, model } from 'mongoose';

const bannerSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  link: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

export const Banner = model('banner', bannerSchema);
