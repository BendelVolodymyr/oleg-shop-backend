import express from 'express';
import cartController from '../controllers/cartController.js';
import guestCartMiddleware from '../middlewares/guestCartMiddleware.js';
import authOrGuestMiddleware from '../middlewares/authOrGuestMiddleware.js';
import mergeGuestCartMiddleware from '../middlewares/mergeGuestCartMiddleware.js';

const cartRouter = express.Router();

cartRouter.get('/');
cartRouter.post(
  '/',
  guestCartMiddleware,
  authOrGuestMiddleware,
  mergeGuestCartMiddleware,
  cartController.addCart
);
cartRouter.put('/:id');
cartRouter.delete('/:id');

export default cartRouter;
