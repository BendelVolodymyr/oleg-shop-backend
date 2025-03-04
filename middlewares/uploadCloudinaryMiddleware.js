import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { ctrlWrapper } from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';

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

  req.movedFiles = [];

  for (const file of req.files) {
    const filePath = path.join(directoryPath, file.filename);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'product',
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
      filename: file.filename, // Назва файлу
      url: result.secure_url, // URL Cloudinary
    });

    // Опціонально: видаляємо файл після завантаження
    fs.unlinkSync(filePath);
  }

  next();
};

export default {
  uploadCloudinaryMiddleware: ctrlWrapper(uploadCloudinaryMiddleware),
};
