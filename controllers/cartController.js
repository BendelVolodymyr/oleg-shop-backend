import { ctrlWrapper } from '../helpers/ctrlWrapper';
import HttpError from '../helpers/HttpError';

const allCart = async (req, res, next) => {
  //допрацювати пошук по юзеру
  const result = await allCart();
  if (!result || result.length === 0) {
    throw HttpError(404, 'No cart found');
  }
  res.status(201).json(result);
};

const addCart = async (req, res, next) => {};

const updateCart = async (req, res, next) => {};

const deleteCart = async (req, res, next) => {};

export default {
  allCart: ctrlWrapper(allCart),
  addCart: ctrlWrapper(addCart),
  updateCart: ctrlWrapper(updateCart),
  deleteCart: ctrlWrapper(deleteCart),
};
