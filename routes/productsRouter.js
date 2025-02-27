import express from 'express';

import productsController from '../controllers/productsController.js';
import { adminAuthMiddleware } from '../middlewares/AdminAuthMiddleware.js';

const productRouter = express.Router();

productRouter.get('/', productsController.getAllProduct);
productRouter.post(
  '/create',
  adminAuthMiddleware,
  productsController.createNewPRoduct
);

export default productRouter;
