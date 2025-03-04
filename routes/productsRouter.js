import express from 'express';

import productsController from '../controllers/productsController.js';
import { adminAuthMiddleware } from '../middlewares/AdminAuthMiddleware.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import uploadCloudinaryMiddleware from '../middlewares/uploadCloudinaryMiddleware.js';

const productRouter = express.Router();

productRouter.get('/', productsController.getAllProduct);
productRouter.post(
  '/create',
  adminAuthMiddleware,
  uploadMiddleware.upload.array('images', 5),
  uploadCloudinaryMiddleware.uploadCloudinaryMiddleware,
  productsController.createNewPRoduct
);

export default productRouter;
