import { Product } from '../models/productModel.js';

const listAllProduct = (skip, limit) => {
  return Product.find({}, '-createdAt -updatedAt').skip(skip).limit(limit);
};

const addNewProduct = body => Product.create(body);

export default { listAllProduct, addNewProduct };
