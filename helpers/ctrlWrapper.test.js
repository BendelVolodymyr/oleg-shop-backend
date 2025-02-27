import { ctrlWrapper } from './ctrlWrapper';

describe('ctrlWrapper', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {}; // Можна додавати будь-які властивості, які використовуються в контролерах
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should call next when controller executes successfully', async () => {
    const mockController = jest.fn().mockResolvedValue(true); // Мокання успішного контролера

    const wrappedCtrl = ctrlWrapper(mockController);
    await wrappedCtrl(mockReq, mockRes, mockNext);

    expect(mockController).toHaveBeenCalledWith(mockReq, mockRes, mockNext); // Перевіряємо, чи викликається контролер з правильними параметрами
    expect(mockNext).not.toHaveBeenCalled(); // Перевіряємо, що next не був викликаний з помилкою
  });

  it('should call next with error when controller throws an error', async () => {
    const mockError = new Error('Test Error');
    const mockController = jest.fn().mockRejectedValue(mockError); // Мокання контролера з помилкою

    const wrappedCtrl = ctrlWrapper(mockController);
    await wrappedCtrl(mockReq, mockRes, mockNext);

    expect(mockController).toHaveBeenCalledWith(mockReq, mockRes, mockNext); // Перевіряємо, чи викликається контролер з правильними параметрами
    expect(mockNext).toHaveBeenCalledWith(mockError); // Перевіряємо, що next був викликаний з помилкою
  });
});
