import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import HttpError from '../helpers/HttpError.js';
import authService from '../services/authService.js';

const SECRET_KEY = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
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
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await authService.controlId(decoded.id);
    if (!user) {
      next(HttpError(401, 'Invalid user'));
    }

    if (!user.accessToken || user.accessToken != token) {
      next(HttpError(401, 'Invalid token'));
    }

    req.user = { ...decoded, email: user.email };
    return next();
  } catch (error) {
    return next(HttpError(401, 'Invalid token'));
  }
};

/// need testing
