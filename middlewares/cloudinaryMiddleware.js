import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import bannerService from '../services/bannerService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directoryPath = path.join(__dirname, '..', 'uploads');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinaryMiddleware = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    throw HttpError(400, 'No files uploaded');
  }

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const folderType = req.body.folderType || 'product';

  req.movedFiles = [];

  for (const file of req.files) {
    const filePath = path.join(directoryPath, file.filename);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderType,
    });

    const url = cloudinary.url(result.public_id, {
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        {
          width: 300,
          height: 150,
          crop: 'fill',
          gravity: 'auto',
        },
      ],
    });

    req.movedFiles.push({
      filename: file.filename,
      url: result.secure_url,
      urlId: result.public_id,
    });

    // Опціонально: видаляємо файл після завантаження
    fs.unlinkSync(filePath);
  }

  next();
};

const patchFileCloudinaryMiddleware = async (req, res, next) => {
  const paramsId = req.params.id;
  const folderType = req.body.folderType;

  if (!req.file) {
    return next();
  }

  let type;

  // в майбутньому використовуват на інші if() поки тест
  if (folderType === 'banners') {
    type = await bannerService.getBannerById(paramsId);
  }

  await cloudinary.uploader.destroy(type.urlId);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const filePath = path.join(directoryPath, req.file.filename);
  const result = await cloudinary.uploader.upload(filePath, {
    folder: folderType,
  });

  const urls = cloudinary.url(result.public_id, {
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      {
        width: 300,
        height: 150,
        crop: 'fill',
        gravity: 'auto',
      },
    ],
  });

  req.body = {
    ...req.body,
    urlImg: urls,
    urlId: result.public_id,
  };

  // Опціонально: видаляємо файл після завантаження
  fs.unlinkSync(filePath);

  next();
};

const uploadFileCloudinaryMiddleware = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const folderType = req.body.folderType || 'banners';

  const filePath = path.join(directoryPath, req.file.filename);
  const result = await cloudinary.uploader.upload(filePath, {
    folder: folderType,
  });

  const urls = cloudinary.url(result.public_id, {
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      {
        width: 300,
        height: 150,
        crop: 'fill',
        gravity: 'auto',
      },
    ],
  });

  req.movedFiles = {
    filename: req.file.filename,
    url: result.secure_url,
    urlId: result.public_id,
  };

  // Опціонально: видаляємо файл після завантаження
  fs.unlinkSync(filePath);

  next();
};

const deleteCloudinaryMiddleware = async (req, res) => {
  const { urlId, _id } = req.resultData;

  const result = await cloudinary.uploader.destroy(urlId);

  res.status(200).json({
    message: `Banner id:"${_id}", deleted successfully`,
    result,
  });
};

const deletesCloudinaryMiddleware = async (req, res) => {
  const { urlId, _id } = req.resultData;
};

export default {
  uploadFileCloudinaryMiddleware: ctrlWrapper(uploadFileCloudinaryMiddleware),
  uploadCloudinaryMiddleware: ctrlWrapper(uploadCloudinaryMiddleware),
  deleteCloudinaryMiddleware: ctrlWrapper(deleteCloudinaryMiddleware),
  deletesCloudinaryMiddleware: ctrlWrapper(deletesCloudinaryMiddleware),
  patchFileCloudinaryMiddleware: ctrlWrapper(patchFileCloudinaryMiddleware),
};
