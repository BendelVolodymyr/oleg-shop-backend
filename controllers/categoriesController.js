import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import categoriesService from '../services/categoriesService.js';

const typeCategories = async (req, res, next) => {
  req.body.folderType = 'categories';
  next();
};

const getCategories = async (req, res, next) => {
  const result = await categoriesService.listCategories();
  if (!result || result.length === 0) {
    throw HttpError(404, 'No categories found');
  }
  res.status(201).json(result);
};

const createCategories = async (req, res, next) => {
  const { body, user, movedFiles } = req;
  const { name, description } = req.body;

  if (!name || !description) {
    throw HttpError(400, 'Category name and description are required');
  }

  // const imageUrls =
  //   movedFiles?.map(file => `/public/product/${file.filename}`) || []; це для звичайного переміщення фото в бекенді, зберігаємо шлях (бекенд додамо нафронті)

  const imageUrls = movedFiles?.map(file => file.url) || []; // Це переміщення на cloudinary, зберігаємо повністю посилання

  const category = {
    ...body,
    images: imageUrls,
    adminName: user.adminName,
    role: user.role,
  };

  const result = await categoriesService.addCategory(category);
  if (!result) {
    throw HttpError(500, 'Failed to create category, please try again');
  }

  res.json(result);
};

const createSubcategory = async (req, res, next) => {
  const { body, user, movedFiles } = req;
  const { name, description } = req.body;

  if (!name || !description) {
    throw HttpError(400, 'Subcategory name and description are required');
  }

  const imageUrls = movedFiles?.map(file => file.url) || [];

  const subcategory = {
    ...body,
    images: imageUrls,
    adminName: user.adminName,
    role: user.role,
  };

  const result = await categoriesService.addSubcategory(subcategory);
  if (!result) {
    throw HttpError(500, 'Failed to create subcategory, please try again');
  }

  res.json(result);
};

const upCategory = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw HttpError(400, 'Category ID is required');
  }

  const result = await categoriesService.updateCategory(id, req.body);
  if (!result) {
    throw HttpError(404, 'Category with this ID was not found');
  }

  res.status(200).json(result);
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw HttpError(400, 'Category ID is required');
  }

  const result = await categoriesService.removeCategory(id);
  console.log(result);

  if (!result) {
    throw HttpError(404, 'Category with this ID was not found');
  }

  res.status(200).json(result);
};

export default {
  deleteCategory: ctrlWrapper(deleteCategory),
  upCategory: ctrlWrapper(upCategory),
  createCategories: ctrlWrapper(createCategories),
  getCategories: ctrlWrapper(getCategories),
  typeCategories: ctrlWrapper(typeCategories),
  createSubcategory: ctrlWrapper(createSubcategory),
};
