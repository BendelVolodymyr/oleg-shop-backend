import express from 'express';

import validateBody from '../middlewares/validateBody.js';
import authController from '../controllers/authController.js';
import { validateUser } from '../models/userModel.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(validateUser.registerJoiSchema),
  authController.registerUser
);
authRouter.post(
  '/login',
  validateBody(validateUser.loginJoiSchema),
  authController.loginUser
);
authRouter.get('/verify/:verificationCode', authController.verifyEmail);
authRouter.post(
  '/verify',
  validateBody(validateUser.verifyJoiSchema),
  authController.resendVerifyEmail
);
authRouter.post('/logout', authMiddleware, authController.logoutUser);

export default authRouter;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Авторизація користувачів
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *     responses:
 *       201:
 *         description: Користувач успішно зареєстрований
 *       400:
 *         description: Невірні дані
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вхід користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *     responses:
 *       200:
 *         description: Успішний вхід, повертає токен
 *       401:
 *         description: Невірний email або пароль
 */

/**
 * @swagger
 * /auth/verify/{verificationCode}:
 *   get:
 *     summary: Підтвердження email через код
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: verificationCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Код підтвердження email
 *     responses:
 *       200:
 *         description: Email успішно підтверджено
 *       400:
 *         description: Невірний код або користувач вже підтверджений
 */

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Повторне відправлення листа підтвердження email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Лист з підтвердженням надіслано
 *       400:
 *         description: Email вже підтверджений або не знайдений
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Вихід користувача (анулювання токену)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Користувач успішно вийшов
 *       401:
 *         description: Користувач не авторизований
 */
