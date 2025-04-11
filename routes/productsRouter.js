import express from 'express';

import productsController from '../controllers/productsController.js';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import cloudinaryMiddleware from '../middlewares/cloudinaryMiddleware.js';

const productRouter = express.Router();

productRouter.get('/', productsController.getAllProduct);
productRouter.post(
  '/create',
  adminAuthMiddleware,
  uploadMiddleware.upload.array('images', 5),
  cloudinaryMiddleware.uploadCloudinaryMiddleware,
  productsController.createNewPRoduct
);

export default productRouter;
