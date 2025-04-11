import { Banner } from '../models/bannerModel.js';

const addBanner = body => Banner.create(body);

const updateBanner = (id, body) =>
  Banner.findByIdAndUpdate(
    { _id: id },
    { $set: body },
    { new: true, runValidators: true }
  );

const deleteBanner = id => Banner.findByIdAndDelete({ _id: id });

const allBanners = () => Banner.find();

const getBannerById = id => Banner.findOne({ _id: id });

export default {
  addBanner,
  deleteBanner,
  allBanners,
  getBannerById,
  updateBanner,
};
