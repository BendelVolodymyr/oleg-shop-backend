import { Category, Subcategory } from '../models/categoryModel.js';

const listCategories = () => Category.find();

const addCategory = body => Category.create(body);

const addSubcategory = body => Subcategory.create(body);

const updateCategory = (id, body) =>
  Category.findByIdAndUpdate(id, body, { new: true });

const removeCategory = id => Category.findByIdAndDelete(id);

export default {
  listCategories,
  addCategory,
  addSubcategory,
  updateCategory,
  removeCategory,
};
