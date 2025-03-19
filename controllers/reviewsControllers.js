import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import productService from '../services/productService.js';
import reviewsService from '../services/reviewsService.js';

const typeReviews = async (req, res, next) => {
  req.body.folderType = 'reviews';
  next();
};

const createReviewProduct = async (req, res, next) => {
  const { user, body, movedFiles, params } = req;

  if (!user) {
    throw HttpError(401, 'Not authorized');
  }
  const { id } = params;
  const { comment, rating } = body;

  const resultProduct = await productService.controlIdProduct(id);
  if (!resultProduct) {
    throw HttpError(400, 'Invalid product ID');
  }

  if (!comment || !rating) {
    throw HttpError(400, 'Missing required fields');
  }

  const imageUrls = movedFiles?.map(file => file.url) || [];

  const review = {
    productId: id,
    user: {
      _id: user.id,
      email: user.email,
    },
    comment,
    rating,
    images: imageUrls,
    status: 'pending',
  };

  const newReview = await reviewsService.addReview(review);

  res.status(201).json({
    message: 'Review added successfully',
    review: newReview,
  });
};

const moderateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { status } = req.body;
  const { user } = req;

  if (!['approved', 'rejected'].includes(status)) {
    throw HttpError(400, 'Invalid status');
  }

  const review = await reviewsService.controlIdReview(reviewId);

  if (!review) {
    throw HttpError(404, 'Review not found');
  }

  // Перевірка, чи коментар ще на модерації
  if (review.status !== 'pending') {
    throw HttpError(400, 'Review has already been moderated');
  }

  const newStatus = {
    status: status,
    moderatedBy: user.id,
    moderatedAt: new Date(),
  };

  const result = await reviewsService.updateReviewStatus(reviewId, newStatus);

  res.status(200).json({
    message: `Review has been ${result.status}`,
    result,
  });
};

export default {
  createReviewProduct: ctrlWrapper(createReviewProduct),
  typeReviews: ctrlWrapper(typeReviews),
  moderateReview: ctrlWrapper(moderateReview),
};
