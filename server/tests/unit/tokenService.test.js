describe('tokenService cookie options', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.resetModules();
  });

  test('uses cross-site safe cookie options in production', () => {
    process.env.NODE_ENV = 'production';
    jest.resetModules();
    const { getCookieOptions } = require('../../services/tokenService');

    const options = getCookieOptions();
    expect(options.secure).toBe(true);
    expect(options.sameSite).toBe('none');
    expect(options.httpOnly).toBe(true);
  });

  test('uses lax cookie options in non-production', () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();
    const { getCookieOptions } = require('../../services/tokenService');

    const options = getCookieOptions();
    expect(options.secure).toBe(false);
    expect(options.sameSite).toBe('lax');
    expect(options.httpOnly).toBe(true);
  });
});
