import express from 'express';
import categoriesController from '../controllers/categoriesController.js';

const categoriesRouter = express.Router();

categoriesRouter.get('/', categoriesController.getCategories);

categoriesRouter.put('/', categoriesController.createCategories);

categoriesRouter.put('/:id', categoriesController.upCategory);
categoriesRouter.delete('/:id', categoriesController.deleteCategory);

export default categoriesRouter;
