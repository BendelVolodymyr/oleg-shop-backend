import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

import { User } from '../models/userModel.js';

const generateToken = user => {
  const payload = { id: user._id };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '4h' });
};

const passwordCompare = async (password, userPassword) =>
  await bcrypt.compare(password, userPassword);

const controlEmail = email => User.findOne({ email });

const controlId = id => User.findById(id);

const registerAuth = async ({ name, email, password }) => {
  const existingUser = await controlEmail(email);
  if (existingUser) throw HttpError(409, 'Email already in use');

  const hashPassword = await bcrypt.hash(password, 10);

  return await User.create({ name, email, password: hashPassword });
};

const logoutUser = _id => User.findByIdAndUpdate(_id, { token: null });
// const loginAuth = body => User.;

export default {
  registerAuth,
  controlEmail,
  generateToken,
  passwordCompare,
  controlId,
};
