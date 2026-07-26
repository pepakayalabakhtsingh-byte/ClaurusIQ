const ReliabilitySession = require('../models/ReliabilitySession');
const AppError = require('../utils/AppError');

exports.getReliabilitySession = async (req, res, next) => {
  try {
    const session = await ReliabilitySession.findById(req.params.id);
    
    if (!session) {
      return next(new AppError('Reliability session not found', 404));
    }

    if (session.userId.toString() !== req.user.id && req.user.role !== 'admin') {
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

exports.getReliabilityHistory = async (req, res, next) => {
  try {
    const sessions = await ReliabilitySession.find({ ownerId: req.user.id })
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

exports.deleteReliabilitySession = async (req, res, next) => {
  try {
    const session = await ReliabilitySession.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id
    });

    if (!session) {
      return next(new AppError('Reliability session not found or not authorized', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
