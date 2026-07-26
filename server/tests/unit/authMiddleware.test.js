jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('../../models/User', () => ({
  findById: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { authenticateUser } = require('../../middleware/auth');

describe('authenticateUser middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('accepts bearer token from query string (SSE flow)', async () => {
    const req = {
      cookies: {},
      headers: {},
      query: { token: 'query-token' },
    };
    const res = {};
    const next = jest.fn();

    jwt.verify.mockReturnValue({ id: 'user-123' });
    User.findById.mockResolvedValue({
      id: 'user-123',
      accountStatus: 'active',
    });

    await authenticateUser(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('query-token', expect.any(String));
    expect(User.findById).toHaveBeenCalledWith('user-123');
    expect(req.user).toEqual(expect.objectContaining({ id: 'user-123' }));
    expect(next).toHaveBeenCalledWith();
  });

  test('returns unauthorized when token is missing', async () => {
    const req = {
      cookies: {},
      headers: {},
      query: {},
    };
    const res = {};
    const next = jest.fn();

    await authenticateUser(req, res, next);

    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.statusCode).toBe(401);
  });
});
