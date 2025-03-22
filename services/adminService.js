import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET_ADMIN_KEY = process.env.JWT_SECRET_ADMIN;
const JWT_REFRESH_ADMIN_KEY = process.env.JWT_REFRESH_ADMIN;

import { Admin } from '../models/adminModel.js';
import HttpError from '../helpers/HttpError.js';

const helpersServices = {
  async createHashToken(tokenRef, salt = 10) {
    return await bcrypt.hash(tokenRef, salt);
  },
};

const verifyRefreshToken = async token => {
  const decoded = jwt.verify(token, JWT_REFRESH_ADMIN_KEY);

  const admin = await Admin.findById(decoded.id);

  if (!admin || !admin.refreshToken)
    throw HttpError(401, 'User not found or refresh token is missing');

  const isMatch = await bcrypt.compare(token, admin.refreshToken);

  if (!isMatch) throw HttpError(401, 'Refresh token does not match');

  return admin;
};

const createAccessToken = admin => {
  const payload = {
    id: admin._id,
    role: admin.role,
    adminName: admin.adminName,
  };
  return jwt.sign(payload, JWT_SECRET_ADMIN_KEY, { expiresIn: '4h' });
};

const createRefreshToken = admin => {
  const payload = {
    id: admin._id,
    role: admin.role,
    adminName: admin.adminName,
  };
  return jwt.sign(payload, JWT_REFRESH_ADMIN_KEY, { expiresIn: '30d' });
};

const passwordCompare = async (password, userPassword) =>
  await bcrypt.compare(password, userPassword);

const controlEmail = email => Admin.findOne({ email });

const controlId = id => Admin.findById(id);

const registerAdmin = async ({ adminName, email, password, role }) => {
  const existingAdmin = await controlEmail(email);

  if (existingAdmin) throw HttpError(409, 'Email already in use');

  const hashPassword = await bcrypt.hash(password, 10);

  return await Admin.create({
    adminName,
    email,
    password: hashPassword,
    role,
  });
};

const updateTokens = async (id, tokenAcs, tokenRef) => {
  if (!id || !tokenAcs || !tokenRef)
    throw HttpError(
      400,
      'Missing required parameters: id, accessToken, or refreshToken'
    );

  const hashToken = await helpersServices.createHashToken(tokenRef, 10);

  await Admin.findByIdAndUpdate(id, {
    accessToken: tokenAcs,
    refreshToken: hashToken,
  });
};

const logoutAdmin = _id => Admin.findByIdAndUpdate(_id, { token: null });

export default {
  verifyRefreshToken,
  registerAdmin,
  controlEmail,
  createAccessToken,
  createRefreshToken,
  passwordCompare,
  controlId,
  updateTokens,
};
