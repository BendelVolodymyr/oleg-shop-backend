import express from 'express';
import {
  createCategories,
  deleteCategory,
  getCategories,
  upCategory,
} from '../controllers/categoriesController.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/', getCategories);

categoriesRouter.put('/', createCategories);

categoriesRouter.put('/:id', upCategory);
categoriesRouter.delete('/:id', deleteCategory);

export default categoriesRouter;
