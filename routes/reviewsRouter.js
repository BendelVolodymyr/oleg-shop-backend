import express from 'express';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import reviewsControllers from '../controllers/reviewsControllers.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import cloudinaryMiddleware from '../middlewares/cloudinaryMiddleware.js';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';

const reviewsRouter = express.Router();

reviewsRouter.get('/');
reviewsRouter.post(
  '/:id',
  authMiddleware,
  uploadMiddleware.upload.array('images', 2),
  reviewsControllers.typeReviews,
  cloudinaryMiddleware.uploadCloudinaryMiddleware,
  reviewsControllers.createReviewProduct
);
reviewsRouter.post(
  '/moderate/:reviewId/status',
  adminAuthMiddleware,
  reviewsControllers.moderateReview
);

export default reviewsRouter;
