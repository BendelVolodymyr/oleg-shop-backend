import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH;

import { User } from '../models/userModel.js';
import HttpError from '../helpers/HttpError.js';

const helpersServices = {
  async createHashToken(tokenRef, salt = 10) {
    return await bcrypt.hash(tokenRef, salt);
  },
};

const verifyRefreshToken = async token => {
  const decoded = jwt.verify(token, JWT_REFRESH_KEY);
  const user = await User.findById(decoded.id);

  if (!user || !user.refreshToken)
    throw HttpError(401, 'User not found or refresh token is missing');

  const isMatch = await bcrypt.compare(token, user.refreshToken);

  if (!isMatch) throw HttpError(401, 'Refresh token does not match');

  return user;
};

const createAccessToken = user => {
  const payload = { id: user._id };
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '4h' });
};

const createRefreshToken = user => {
  const payload = { id: user._id };
  return jwt.sign(payload, JWT_REFRESH_KEY, { expiresIn: '30d' });
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

const updateTokens = async (id, tokenAcs, tokenRef) => {
  if (!id || !tokenAcs || !tokenRef)
    throw HttpError(
      400,
      'Missing required parameters: id, accessToken, or refreshToken'
    );

  const hashToken = await helpersServices.createHashToken(tokenRef, 10);

  await User.findByIdAndUpdate(id, {
    accessToken: tokenAcs,
    refreshToken: hashToken,
  });
};

const updateRefreshToken = async (id, refreshToken) =>
  await User.findByIdAndUpdate(id, { refreshToken });

const logoutUser = _id => User.findByIdAndUpdate(_id, { token: null });

export default {
  verifyRefreshToken,
  updateUseVerify,
  registerAuth,
  controlEmail,
  controlVerifyCode,
  createAccessToken,
  createRefreshToken,
  passwordCompare,
  controlId,
  updateTokens,
  updateRefreshToken,
  generateCode,
};
