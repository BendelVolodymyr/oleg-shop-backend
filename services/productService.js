import modelProduct from '../models/productModel.js';

const controlIdProduct = id => modelProduct.Product.findById(id);

const listAllProduct = (skip, limit) => {
  return modelProduct.Product.find({}, '-createdAt -updatedAt')
    .skip(skip)
    .limit(limit);
};

const addNewProduct = body => modelProduct.Product.create(body);

export default { listAllProduct, addNewProduct, controlIdProduct };
