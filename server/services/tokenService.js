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

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user,
    });
};

module.exports = { generateToken, verifyToken, sendTokenResponse };
