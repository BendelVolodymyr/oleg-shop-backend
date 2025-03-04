// Для використання переміщення фото в бекенді
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

import HttpError from '../helpers/HttpError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tempDir = path.join(__dirname, '../uploads/');
const publicDir = path.join(__dirname, '../public/product/');

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const originalName = path
      .parse(file.originalname)
      .name.replace(/\s+/g, '-'); // Очищення пробілів
    const customName = req.body.customFileName || originalName; // Використовуємо кастомне ім'я або оригінальне
    const extension = path.extname(file.originalname); // Розширення файлу
    const uniqueId = uuidv4(); // Генерація унікального ідентифікатора за допомогою uuidv4
    const finalFileName = `${uniqueId}${extension}`; // Формуємо фінальне ім'я файлу, яке буде з UUID
    cb(null, finalFileName); // Використовуємо нове ім'я файлу
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(HttpError(415, 'Invalid file type. Only images are allowed!'), false);
  }
};

const upload = multer({
  storage: multerConfig,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const moveFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(HttpError(400, 'No files uploaded.'));
    }

    await fs.mkdir(publicDir, { recursive: true });

    const movedFiles = await Promise.all(
      req.files.map(async file => {
        const id = uuidv4();

        const tempFilePath = path.join(tempDir, file.filename);
        const extension = path.extname(file.originalname);
        const newFilename = `${id}${extension}`;

        const newFilePath = path.join(publicDir, newFilename);

        await fs.rename(tempFilePath, newFilePath);

        return {
          filename: newFilename,
          url: `/product/${newFilename}`,
        };
      })
    );

    req.movedFiles = movedFiles;

    next();
  } catch (error) {
    next(error);
  }
};

export default { moveFiles, upload };
