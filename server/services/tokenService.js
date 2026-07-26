const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

const getCookieOptions = () => {
  const isProduction = config.env === 'production';

  return {
    expires: new Date(
      Date.now() + parseInt(process.env.COOKIE_EXPIRE || 7, 10) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  };
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res
    .status(statusCode)
    .cookie('token', token, getCookieOptions())
    .json({
      success: true,
      token,
      user,
    });
};

module.exports = { generateToken, verifyToken, sendTokenResponse, getCookieOptions };
