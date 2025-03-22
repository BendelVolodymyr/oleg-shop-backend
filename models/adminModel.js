import Joi from 'joi';
import { Schema, model } from 'mongoose';

const adminSchema = new Schema(
  {
    adminName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager'], default: 'manager' },
    accessToken: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true }
);

const joiAdminSchema = Joi.object({
  adminName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  role: Joi.string().valid('admin', 'manager').required(),
});

export const validateAdmin = { joiAdminSchema };

export const Admin = model('admin', adminSchema);
