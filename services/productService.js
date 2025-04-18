import productModel from '../models/productModel.js';

const controlIdProduct = id => productModel.Product.findById(id);

const listAllProduct = (skip, limit) => {
  return productModel.Product.find({}, '-createdAt -updatedAt')
    .skip(skip)
    .limit(limit);
};

const addNewProduct = body => productModel.Product.create(body);

export default { listAllProduct, addNewProduct, controlIdProduct };
