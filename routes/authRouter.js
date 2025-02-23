import express from 'express';

import validateBody from '../middlewares/validateBody.js';
import authController from '../controllers/authController.js';
import { loginSchema, registerSchema } from '../models/userModel.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(registerSchema),
  authController.registerUser
);
authRouter.post(
  '/login',
  authMiddleware,
  validateBody(loginSchema),
  authController.loginUser
);
// authRouter.post('/logout', authMiddleware, logout);

export default authRouter;
