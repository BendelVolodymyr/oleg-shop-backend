import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';

const typeBanner = (req, res, next) => {
  req.body.folderType = 'banners';
  next();
};

const createBanner = (req, res) => {
  const { body, user, movedFiles } = req;
  const { title, description, link, startDate, endDate } = body;
};

const deleteBanner = (req, res) => {};

const updateBanner = (req, res) => {};

const getBanner = (req, res) => {};

export default {
  typeBanner: ctrlWrapper(typeBanner),
  updateBanner: ctrlWrapper(updateBanner),
  deleteBanner: ctrlWrapper(deleteBanner),
  createBanner: ctrlWrapper(createBanner),
  getBanner: ctrlWrapper(getBanner),
};
