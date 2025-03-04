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
  const { body, user, movedFiles } = req;
  const { name, description, price, category } = body;

  if (!name || !description || !price || !category)
    throw HttpError(400, 'All required fields must be provided');

  // const imageUrls =
  //   movedFiles?.map(file => `/public/product/${file.filename}`) || []; це для звичайного переміщення фото в бекенді, зберігаємо шлях (бекенд додамо нафронті)

  const imageUrls = movedFiles?.map(file => file.url) || []; // Це переміщення на cloudinary, зберігаємо повністю посилання

  const product = {
    ...body,
    images: imageUrls,
    adminName: user.adminName,
    role: user.role,
  };

  const newProduct = await productService.addNewProduct(product);

  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct,
  });
};

export default {
  getAllProduct: ctrlWrapper(getAllProduct),
  createNewPRoduct: ctrlWrapper(createNewPRoduct),
};
