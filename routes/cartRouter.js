import express from 'express';
import cartController from '../controllers/cartController.js';
import guestCartMiddleware from '../middlewares/guestCartMiddleware.js';
import authOrGuestMiddleware from '../middlewares/authOrGuestMiddleware.js';
import mergeGuestCartMiddleware from '../middlewares/mergeGuestCartMiddleware.js';
import checkCartStockMiddleware from '../middlewares/checkCartStockMiddleware.js';

const cartRouter = express.Router();

cartRouter.get('/');
cartRouter.post(
  '/',
  guestCartMiddleware,
  authOrGuestMiddleware,
  mergeGuestCartMiddleware,

  cartController.addCart
);
cartRouter.put(
  '/item',
  guestCartMiddleware,
  authOrGuestMiddleware,
  mergeGuestCartMiddleware,
  checkCartStockMiddleware,
  cartController.updateCartItem
);
cartRouter.delete(
  '/:id',
  guestCartMiddleware,
  authOrGuestMiddleware,
  mergeGuestCartMiddleware,
  cartController.deleteCartItem
);

export default cartRouter;
