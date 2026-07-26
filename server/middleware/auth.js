const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const config = require('../config/config');

const authenticateUser = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (typeof req.query.token === 'string' && req.query.token.trim()) {
      token = req.query.token.trim();
    }

    if (!token) {
      return next(new AppError('Not authorized. Please log in.', 401));
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User no longer exists.', 401));
    }

    if (user.accountStatus !== 'active') {
      return next(new AppError('Account is not active.', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized. Token invalid.', 401));
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Administrator access required.', 403));
  }
  next();
};

const validateResourceExists = (Model) => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);
      if (!resource) {
        return next(new AppError('Resource not found.', 404));
      }
      req.resource = resource;
      next();
    } catch (error) {
      next(new AppError('Invalid resource ID.', 400));
    }
  };
};

const validateOwnership = (req, res, next) => {
  if (!req.resource) {
    return next(new AppError('Server Error: Resource not loaded.', 500));
  }
  
  if (req.resource.ownerId.toString() !== req.user.id) {
    return next(new AppError('Forbidden: You do not own this resource.', 403));
  }
  
  next();
};

module.exports = { 
  authenticateUser, 
  authorizeAdmin, 
  validateResourceExists, 
  validateOwnership 
};
