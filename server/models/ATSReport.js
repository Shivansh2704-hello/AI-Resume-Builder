const mongoose = require("mongoose");

const atsReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumeText: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  score: Number,
  matchedKeywords: [String],
  missingKeywords: [String],
  suggestion: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ATSReport", atsReportSchema);
