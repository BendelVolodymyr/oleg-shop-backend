import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY_ADMIN = process.env.JWT_SECRET_ADMIN;

import { Admin } from '../models/adminModel.js';
import HttpError from '../helpers/HttpError.js';

const generateToken = admin => {
  const payload = {
    id: admin._id,
    role: admin.role,
    adminName: admin.adminName,
  };
  return jwt.sign(payload, SECRET_KEY_ADMIN, { expiresIn: '4h' });
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

const updateToken = (id, token) => Admin.findByIdAndUpdate(id, { token });

const logoutAdmin = _id => Admin.findByIdAndUpdate(_id, { token: null });

export default {
  registerAdmin,
  controlEmail,
  generateToken,
  passwordCompare,
  controlId,
  updateToken,
};
