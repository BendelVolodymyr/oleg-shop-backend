import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleMongooseError } from '../middlewares/handleMongooseError.js';

const emailRegexp =
  /^(?:(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)|(?:"(?:\\[\x00-\x7F]|[^\\"])*"))@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:\d{1,3}\.){3}\d{1,3}\]))$/;

// const passwordRegexp =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, match: emailRegexp, unique: true, required: true },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  registrationMethod: Joi.string()
    .valid('email', 'google', 'facebook')
    .required()
    .messages({
      'any.only': 'Registration method must be one of: email, google, facebook',
      'any.required': 'Registration method is required',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).max(12).required(),
});

userSchema.post('save', handleMongooseError);

export const User = model('user', userSchema);
