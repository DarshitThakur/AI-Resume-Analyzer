const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional if anonymous upload
  },
  resumeSkills: [{
    type: String
  }],
  jobSkills: [{
    type: String
  }],
  matchScore: {
    type: Number,
    required: true
  },
  missingSkills: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', analysisSchema);
