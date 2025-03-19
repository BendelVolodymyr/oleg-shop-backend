import modelReviews from '../models/reviewsModel.js';

const controlIdReview = id => modelReviews.Review.findById(id);

const addReview = body => modelReviews.Review.create(body);

const updateReviewStatus = (id, status) =>
  modelReviews.Review.findByIdAndUpdate(id, status, { new: true });

export default { controlIdReview, addReview, updateReviewStatus };
