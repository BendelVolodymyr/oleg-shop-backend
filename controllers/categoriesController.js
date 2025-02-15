import HttpError from '../middlewares/HttpError.js';
import {
  addCategory,
  listCategories,
  removeCategory,
  updateCategory,
} from '../services/categoriesService.js';

export const getCategories = async (req, res, next) => {
  try {
    const result = await listCategories();
    if (!result || result.length === 0) {
      throw HttpError(404, 'No categories found');
    }
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const createCategories = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.description) {
      throw HttpError(400, 'Category name and description are required');
    }

    const result = await addCategory(req.body);
    if (!result) {
      throw HttpError(500, 'Failed to create category, please try again');
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const upCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw HttpError(400, 'Category ID is required');
    }

    const result = await updateCategory(id, req.body);
    if (!result) {
      throw HttpError(404, 'Category with this ID was not found');
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw HttpError(400, 'Category ID is required');
    }

    const result = await removeCategory(id);
    console.log(result);

    if (!result) {
      throw HttpError(404, 'Category with this ID was not found');
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
