const jwt = require('jsonwebtoken');
const config = require('../config/config');
const AppError = require('../utils/AppError');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
};
