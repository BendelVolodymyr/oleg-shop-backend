import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET;

import { User } from '../models/userModel.js';
import HttpError from '../helpers/HttpError.js';

const generateToken = user => {
  const payload = { id: user._id };
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '4h' });
};

const generateCode = () => uuidv4();

const passwordCompare = async (password, userPassword) =>
  await bcrypt.compare(password, userPassword);

const controlEmail = email => User.findOne({ email });

const updateUseVerify = _id =>
  User.findByIdAndUpdate(_id, { verify: true, verificationCode: '' });

const controlVerifyCode = verificationCode =>
  User.findOne({ verificationCode });

const controlId = id => User.findById(id);

const registerAuth = async ({ email, password, verificationCode }) => {
  const existingUser = await controlEmail(email);
  if (existingUser) throw HttpError(409, 'Email already in use');

  const hashPassword = await bcrypt.hash(password, 10);

  return await User.create({
    email,
    password: hashPassword,
    verificationCode,
  });
};

const updateToken = (id, token) => User.findByIdAndUpdate(id, { token });

const logoutUser = _id => User.findByIdAndUpdate(_id, { token: null });
// const loginAuth = body => User.;

export default {
  updateUseVerify,
  registerAuth,
  controlEmail,
  controlVerifyCode,
  generateToken,
  passwordCompare,
  controlId,
  updateToken,
  generateCode,
};
