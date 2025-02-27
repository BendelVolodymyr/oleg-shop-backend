import validateBody from './validateBody';
import Joi from 'joi';

describe('validateBody middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {}; // Можна додавати будь-які властивості, які використовуються у тестах
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should call next() when validation is successful', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required(),
    });

    mockReq.body = { name: 'John', age: 25 };

    const validate = validateBody(schema);
    validate(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled(); // Перевіряємо, що next() був викликаний
    expect(mockNext).not.toHaveBeenCalledWith(expect.anything()); // Перевіряємо, що next не був викликаний з помилкою
  });

  it('should call next() with an error when validation fails', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required(),
    });

    mockReq.body = { name: 'John' }; // Відсутній параметр age, валідація має провалитися

    const validate = validateBody(schema);
    validate(mockReq, mockRes, mockNext);

    // Перевіряємо, що next() був викликаний з об'єктом помилки
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: expect.stringContaining('age'),
      })
    );
  });
});
