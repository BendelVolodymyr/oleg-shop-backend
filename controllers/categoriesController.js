import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import categoriesService from '../services/categoriesService.js';

const getCategories = async (req, res, next) => {
  const result = await categoriesService.listCategories();
  if (!result || result.length === 0) {
    throw HttpError(404, 'No categories found');
  }
  res.status(201).json(result);
};

const createCategories = async (req, res, next) => {
  if (!req.body.name || !req.body.description) {
    throw HttpError(400, 'Category name and description are required');
  }

  const result = await categoriesService.addCategory(req.body);
  if (!result) {
    throw HttpError(500, 'Failed to create category, please try again');
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
};
