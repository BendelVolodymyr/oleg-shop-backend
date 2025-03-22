import express from 'express';

import { adminAuthMiddleware } from '../middlewares/AdminAuthMiddleware.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import bannerController from '../controllers/bannerController.js';
import uploadCloudinaryMiddleware from '../middlewares/uploadCloudinaryMiddleware.js';

const bannerRouter = express.Router();

bannerRouter.post(
  '/',
  adminAuthMiddleware,
  uploadMiddleware.upload.single('image'),
  bannerController.typeBanner,
  uploadCloudinaryMiddleware.uploadCloudinaryMiddleware,
  bannerController.createBanner
);

export default bannerRouter;
