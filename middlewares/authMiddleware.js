import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import HttpError from '../helpers/HttpError.js';
import authService from '../services/authService.js';

const SECRET_KEY = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  // Перевірка наявності заголовка Authorization
  if (!authorization) {
    return next(HttpError(401, 'Not authorized: Missing Authorization header'));
  }

  // Використовуємо регулярний вираз для перевірки формату "Bearer <token>"
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
    if (!user) next(HttpError(401, 'Invalid user'));

    req.user = decoded; // Додаємо розшифровану інформацію в req.user
    return next();
  } catch (error) {
    return next(HttpError(401, 'Invalid token'));
  }
};

/// need testing
