import mongoose from 'mongoose';
import { User, validateUser } from './userModel.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  // Створення сервера MongoDB в пам'яті
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await User.deleteMany({}); // Очищення всіх користувачів перед кожним тестом
});

afterAll(async () => {
  // Очищення з'єднання та зупинка серверу
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User model', () => {
  it('should create a user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
  });

  it('should throw validation error if email is invalid', async () => {
    const userData = {
      name: 'John Doe',
      email: 'invalidemail',
      password: 'password123',
    };

    const user = new User(userData);

    try {
      await user.save();
    } catch (error) {
      expect(error.errors.email).toBeDefined(); // Перевіряємо, що є помилка валідації для email
    }
  });

  it('should throw validation error if password is too short', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'short',
    };

    const user = new User(userData);

    try {
      await user.save();
    } catch (error) {
      expect(error.errors.password).toBeDefined(); // Перевіряємо, що є помилка валідації для password
    }
  });

  it('should throw error if email is not unique', async () => {
    const userData1 = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };

    const user1 = new User(userData1);
    await user1.save();

    const userData2 = {
      name: 'Jane Doe',
      email: 'johndoe@example.com', // той самий email
      password: 'password456',
    };

    const user2 = new User(userData2);

    try {
      await user2.save();
    } catch (error) {
      expect(error.code).toBe(11000); // 11000 - код помилки MongoDB для порушення унікальності
    }
  });
});

describe('Register schema validation', () => {
  it('should validate correct registration data', () => {
    const validData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      registrationMethod: 'email',
    };

    const { error } = validateUser.registerJoiSchema.validate(validData);
    expect(error).toBeUndefined(); // Валідація повинна пройти без помилок
  });

  it('should throw error if registration method is invalid', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      registrationMethod: 'invalid_method',
    };

    const { error } = validateUser.registerJoiSchema.validate(invalidData);
    expect(error).toBeDefined(); // Має бути помилка через неправильний метод реєстрації
    expect(error.details[0].message).toBe(
      'Registration method must be one of: email, google, facebook'
    );
  });
});

describe('Login schema validation', () => {
  it('should validate correct login data', () => {
    const validData = {
      email: 'johndoe@example.com',
      password: 'password123',
    };

    const { error } = validateUser.loginJoiSchema.validate(validData);
    expect(error).toBeUndefined(); // Валідація повинна пройти без помилок
  });

  it('should throw error if email is invalid', () => {
    const invalidData = {
      email: 'invalidemail',
      password: 'password123',
    };

    const { error } = validateUser.loginJoiSchema.validate(invalidData);
    expect(error).toBeDefined(); // Має бути помилка через некоректний email
  });

  it('should throw error if password is missing', () => {
    const invalidData = {
      email: 'johndoe@example.com',
    };

    const { error } = validateUser.loginJoiSchema.validate(invalidData);
    expect(error).toBeDefined(); // Має бути помилка через відсутність password
  });
});
