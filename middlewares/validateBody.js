import HttpError from '../helpers/HttpError.js';

const validateBody = schema => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    } else {
      next();
    }
  };

  return func;
};

export default validateBody;
