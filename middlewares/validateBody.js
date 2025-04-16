import fs from 'fs/promises';
import HttpError from '../helpers/HttpError.js';

const validateBody = schema => {
  const func = async (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error(
            '❗ Не вдалося видалити тимчасовий файл:',
            unlinkError.message
          );
        }
      }
      next(HttpError(400, error.message));
    } else {
      next();
    }
  };

  return func;
};

export default validateBody;
