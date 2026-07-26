const VerificationSession = require('../models/VerificationSession');
const AppError = require('../utils/AppError');

exports.getVerificationSession = async (req, res, next) => {
  try {
    const session = await VerificationSession.findById(req.params.id);
    
    if (!session) {
      return next(new AppError('Verification session not found', 404));
    }

    if (session.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to access this session', 403));
    }

    res.status(200).json({
      status: 'success',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

exports.getVerificationHistory = async (req, res, next) => {
  try {
    const sessions = await VerificationSession.find({ ownerId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      status: 'success',
      results: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteVerificationSession = async (req, res, next) => {
  try {
    const session = await VerificationSession.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id
    });

    if (!session) {
      return next(new AppError('Verification session not found or not authorized', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
