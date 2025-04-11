import express from 'express';
import categoriesController from '../controllers/categoriesController.js';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import cloudinaryMiddleware from '../middlewares/cloudinaryMiddleware.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/', categoriesController.getCategories);

categoriesRouter.post(
  '/',
  adminAuthMiddleware,
  uploadMiddleware.upload.array('images', 5),
  categoriesController.typeCategories,
  cloudinaryMiddleware.uploadCloudinaryMiddleware,
  categoriesController.createCategories
);

categoriesRouter.post(
  '/subcategory',
  adminAuthMiddleware,
  uploadMiddleware.upload.array('images', 5),
  categoriesController.typeCategories,
  cloudinaryMiddleware.uploadCloudinaryMiddleware,
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
