import HttpError from './HttpError.js';

describe('HttpError', () => {
  it('should return the correct error message for status 400', () => {
    const error = HttpError(400);
    expect(error.message).toBe('Bad Request');
    expect(error.status).toBe(400);
  });

  it('should return the correct error message for status 401', () => {
    const error = HttpError(401);
    expect(error.message).toBe('Unauthorized');
    expect(error.status).toBe(401);
  });

  it('should return the correct error message for status 403', () => {
    const error = HttpError(403);
    expect(error.message).toBe('Forbidden');
    expect(error.status).toBe(403);
  });

  it('should return the correct error message for status 404', () => {
    const error = HttpError(404);
    expect(error.message).toBe('Not Found');
    expect(error.status).toBe(404);
  });

  it('should return the correct error message for status 409', () => {
    const error = HttpError(409);
    expect(error.message).toBe('Conflict');
    expect(error.status).toBe(409);
  });

  it('should allow passing a custom message', () => {
    const error = HttpError(404, 'Custom Not Found');
    expect(error.message).toBe('Custom Not Found');
    expect(error.status).toBe(404);
  });

  it('should return default error message for an invalid status', () => {
    const error = HttpError(999);
    expect(error.message).toBe(undefined); // This should be undefined, as 999 is not in the messageList
    expect(error.status).toBe(999);
  });
});
