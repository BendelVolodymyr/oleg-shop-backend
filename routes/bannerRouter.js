import express from 'express';

import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import bannerController from '../controllers/bannerController.js';
import cloudinaryMiddleware from '../middlewares/cloudinaryMiddleware.js';
import validateBody from '../middlewares/validateBody.js';
import { joiBannerSchema } from '../models/bannerModel.js';

const bannerRouter = express.Router();

bannerRouter.get('/', bannerController.getBanner);
bannerRouter.post(
  '/',
  adminAuthMiddleware,
  uploadMiddleware.upload.single('image'),
  validateBody(joiBannerSchema.createBannerSchema),
  bannerController.typeBanner,
  cloudinaryMiddleware.createFileCloudinaryMiddleware,
  bannerController.createBanner
);
bannerRouter.delete(
  '/:id',
  adminAuthMiddleware,
  bannerController.deleteBanner,
  cloudinaryMiddleware.deleteCloudinaryMiddleware
);
bannerRouter.patch(
  '/:id',
  adminAuthMiddleware,
  uploadMiddleware.upload.single('image'),
  validateBody(joiBannerSchema.preCloudinaryUpdateSchema),
  bannerController.typeBanner,
  cloudinaryMiddleware.patchFileCloudinaryMiddleware,
  validateBody(joiBannerSchema.updateBannerSchema),
  bannerController.updateBanner
);

export default bannerRouter;

/**
 * @swagger
 * /banners:
 *   post:
 *     summary: Створити новий банер
 *     tags: [Banners]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - link
 *               - startDate
 *               - endDate
 *               - isActive
 *               - type
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               link:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *               type:
 *                 type: string
 *                 enum: [promotion, advertisement, announcement, flash-sale]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Банер створено
 *       400:
 *         description: Невірні дані
 *       401:
 *         description: Неавторизований доступ
 */

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: Отримати список усіх банерів
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Успішне отримання списку банерів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   link:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                   isActive:
 *                     type: boolean
 *                   altImg:
 *                     type: string
 *                   urlImg:
 *                     type: string
 *                   urlId:
 *                     type: string
 *                   adminName:
 *                     type: string
 *                   role:
 *                     type: string
 *                   displayOrder:
 *                     type: integer
 *                   type:
 *                     type: string
 */

/**
 * @swagger
 * /banners/{id}:
 *   delete:
 *     summary: Видалити банер за ID
 *     tags: [Banners]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID банера
 *     responses:
 *       200:
 *         description: Банер успішно видалено
 *       401:
 *         description: Неавторизований доступ
 *       404:
 *         description: Банер не знайдено
 */

/**
 * @swagger
 * /banners/{id}:
 *   patch:
 *     summary: Оновити банер за ID
 *     tags: [Banners]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID банера
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               link:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *               type:
 *                 type: string
 *                 enum: [promotion, advertisement, announcement, flash-sale]
 *               displayOrder:
 *                 type: integer
 *               altImg:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Банер успішно оновлено
 *       400:
 *         description: Невірні дані
 *       401:
 *         description: Неавторизований доступ
 *       404:
 *         description: Банер не знайдено
 */
