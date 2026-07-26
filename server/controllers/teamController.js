const Team = require('../models/Team');
const AppError = require('../utils/AppError');
const logger = require('../config/logger');

// Create a new team
exports.createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const team = await Team.create({
      name,
      description,
      owner: req.user._id
    });

    res.status(201).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

// Get user's teams (owned and member of)
exports.getMyTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id }
      ]
    }).populate('owner', 'name email').populate('members.user', 'name email');

    res.status(200).json({ success: true, count: teams.length, data: teams });
  } catch (error) {
    next(error);
  }
};

// Add member to team
exports.addMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const team = await Team.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!team) return next(new AppError('Team not found or unauthorized', 404));

    // Check if user is already a member
    if (team.members.find(m => m.user.toString() === userId)) {
      return next(new AppError('User is already a member', 400));
    }

    team.members.push({ user: userId, role: role || 'viewer' });
    await team.save();
    
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};
