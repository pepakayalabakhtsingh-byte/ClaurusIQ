const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a team name'],
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      maxlength: 500
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        role: {
          type: String,
          enum: ['editor', 'viewer'],
          default: 'viewer'
        },
        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    sharedResources: {
      workflows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' }],
      documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DocumentSession' }],
      reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReportSession' }]
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster lookups
teamSchema.index({ owner: 1 });
teamSchema.index({ 'members.user': 1 });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
