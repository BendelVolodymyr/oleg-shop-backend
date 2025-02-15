import { Category } from '../models/categoryModel.js';

async function listCategories() {
  const result = await Category.find();
  return result;
}

async function addCategory(body) {
  const result = await Category.create(body);
  return result;
}

async function updateCategory(id, body) {
  const result = await Category.findByIdAndUpdate(id, body, { new: true });
  return result;
}

async function removeCategory(id) {
  const result = await Category.findByIdAndDelete(id);
  return result;
}

export { listCategories, addCategory, updateCategory, removeCategory };
