import express from 'express';

import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import bannerController from '../controllers/bannerController.js';
import cloudinaryMiddleware from '../middlewares/cloudinaryMiddleware.js';
import validateBody from '../middlewares/validateBody.js';
import { joiBannerSchema } from '../models/bannerModel.js';

const bannerRouter = express.Router();

bannerRouter.post(
  '/',
  adminAuthMiddleware,
  uploadMiddleware.upload.single('image'),
  bannerController.typeBanner,
  cloudinaryMiddleware.uploadFileCloudinaryMiddleware,
  bannerController.createBanner
);
bannerRouter.delete(
  '/:id',
  adminAuthMiddleware,
  bannerController.deleteBanner,
  cloudinaryMiddleware.deleteCloudinaryMiddleware
);
bannerRouter.get('/', bannerController.getBanner);

//переналаштувати спочатку видалити а потім додати нове
bannerRouter.patch(
  '/:id',
  adminAuthMiddleware,
  uploadMiddleware.upload.single('image'),
  bannerController.typeBanner,
  cloudinaryMiddleware.patchFileCloudinaryMiddleware,
  validateBody(joiBannerSchema.updateBannerSchema),
  bannerController.updateBanner
);

export default bannerRouter;
