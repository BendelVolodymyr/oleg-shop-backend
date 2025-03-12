import express from 'express';
import categoriesController from '../controllers/categoriesController.js';
import { adminAuthMiddleware } from '../middlewares/AdminAuthMiddleware.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import uploadCloudinaryMiddleware from '../middlewares/uploadCloudinaryMiddleware.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/', categoriesController.getCategories);

categoriesRouter.post(
  '/',
  adminAuthMiddleware,
  uploadMiddleware.upload.array('images', 5),
  categoriesController.typeCategories,
  uploadCloudinaryMiddleware.uploadCloudinaryMiddleware,
  categoriesController.createCategories
);

categoriesRouter.post(
  '/subcategory',
  adminAuthMiddleware,
  uploadMiddleware.upload.array('images', 5),
  categoriesController.typeCategories,
  uploadCloudinaryMiddleware.uploadCloudinaryMiddleware,
  categoriesController.createSubcategory
);

categoriesRouter.put(
  '/:id',
  adminAuthMiddleware,
  categoriesController.upCategory
);
categoriesRouter.delete(
  '/:id',
  adminAuthMiddleware,
  categoriesController.deleteCategory
);

export default categoriesRouter;
