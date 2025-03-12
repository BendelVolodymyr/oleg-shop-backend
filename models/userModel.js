import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleMongooseError } from '../helpers/handleMongooseError.js';

const emailRegexp =
  /^(?:(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)|(?:"(?:\\[\x00-\x7F]|[^\\"])*"))@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:\d{1,3}\.){3}\d{1,3}\]))$/;

// const passwordRegexp =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const userSchema = new Schema(
  {
    email: { type: String, match: emailRegexp, required: true, unique: true },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: '',
    },
    favorite: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
    },
  },
  { versionKey: false, timestamps: true }
);

const registerJoiSchema = Joi.object({
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

const verifyJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).max(12).required(),
});

export const validateUser = {
  loginJoiSchema,
  registerJoiSchema,
  verifyJoiSchema,
};

userSchema.post('save', handleMongooseError);

export const User = model('user', userSchema);
