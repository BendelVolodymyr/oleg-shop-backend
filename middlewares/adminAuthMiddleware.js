import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import HttpError from '../helpers/HttpError.js';
import adminService from '../services/adminService.js';

const SECRET_KEY_ADMIN = process.env.JWT_SECRET_ADMIN;

export const adminAuthMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(HttpError(401, 'Not authorized: Missing Authorization header'));
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return next(
      HttpError(401, 'Not authorized: Invalid Authorization header format')
    );
  }

  const token = match[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY_ADMIN);

    const admin = await adminService.controlId(decoded.id);
    if (!admin) {
      return next(HttpError(401, 'Invalid admin'));
    }

    if (!admin.accessToken || admin.accessToken != token) {
      return next(HttpError(401, 'Invalid token'));
    }

    if (admin.role !== 'admin') {
      return next(HttpError(403, 'Access denied: Admin only'));
    }

    req.user = decoded;
    return next();
  } catch (error) {
    return next(HttpError(401, 'Invalid token'));
  }
};
