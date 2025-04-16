import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import bannerService from '../services/bannerService.js';

const typeBanner = (req, res, next) => {
  req.body.folderType = 'banners';

  next();
};

const createBanner = async (req, res) => {
  const { body, user, movedFiles } = req;

  const {
    title,
    description,
    link,
    startDate,
    endDate,
    isActive = true,
    altImg,
    displayOrder,
    type,
  } = body;

  if (
    !title ||
    !description ||
    !link ||
    !startDate ||
    !endDate ||
    !altImg ||
    !displayOrder ||
    !type
  )
    throw HttpError(400, 'All required fields must be provided');

  const banner = {
    title,
    description,
    link,
    startDate,
    endDate,
    altImg,
    isActive,
    urlImg: movedFiles.url,
    urlId: movedFiles.urlId,
    adminName: user.adminName,
    role: user.role,
    displayOrder,
    type,
  };

  const newBanner = await bannerService.addBanner(banner);

  if (!newBanner) {
    throw HttpError(500, 'Failed to create banner, please try again');
  }

  res.json(newBanner);
};

const deleteBanner = async (req, res, next) => {
  const bannerId = req.params.id;

  // const test
  let result;

  if (!bannerId) throw HttpError(400, 'Bad request: ID is required');

  const banner = await bannerService.getBannerById(bannerId);

  if (banner === null) throw HttpError(404, 'Banner not found');

  result = await bannerService.deleteBanner(bannerId);

  req.resultData = result;

  next();
};

const updateBanner = async (req, res) => {
  const bannerId = req.params.id;

  if (!bannerId) throw HttpError(400, 'Bad request: ID is required');

  const banner = await bannerService.getBannerById(bannerId);

  if (banner === null) throw HttpError(404, 'Banner not found');

  const result = await bannerService.updateBanner(bannerId, req.body);

  res.status(200).json(result);
};

const getBanner = async (req, res) => {
  const banners = await bannerService.allBanners();

  res.status(200).json(banners);
};

export default {
  typeBanner: ctrlWrapper(typeBanner),
  updateBanner: ctrlWrapper(updateBanner),
  deleteBanner: ctrlWrapper(deleteBanner),
  createBanner: ctrlWrapper(createBanner),
  getBanner: ctrlWrapper(getBanner),
};
