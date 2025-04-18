import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authService from '../services/authService.js';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

const authOrGuestMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const match = authorization.match(/^Bearer\s+(.+)$/i);

    if (match) {
      const token = match[1];
      try {
        const decoded = jwt.verify(token, SECRET_KEY);

        const user = await authService.controlId(decoded.id);

        if (user && user.accessToken === token) {
          req.user = { id: user._id, email: user.email };
        }
      } catch (err) {
        // токен не валідний, але не зупиняємо
      }
    }
  }

  // якщо нема токена — нічого не робимо, просто next()
  next();
};

export default authOrGuestMiddleware;
