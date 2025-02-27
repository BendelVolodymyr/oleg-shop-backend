import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import productService from '../services/productService.js';

const getAllProduct = async (req, res, next) => {
  const { page = 1, limit = 4 } = req.query;
  const skip = (page - 1) * limit;

  const allListProduct = await productService.listAllProduct(skip, limit);
  res.send(allListProduct);
};

const createNewPRoduct = async (req, res, next) => {
  const { body, user } = req;

  const { name, description, price, category, images } = body;

  if (!name || !description || !price || !category || !images)
    throw HttpError(400, 'All required fields must be provided');
  const product = { ...body, adminName: user.adminName, role: user.role };

  console.log(product);

  const newProduct = await productService.addNewProduct(product);
  res.send(newProduct);
};

export default {
  getAllProduct: ctrlWrapper(getAllProduct),
  createNewPRoduct: ctrlWrapper(createNewPRoduct),
};
