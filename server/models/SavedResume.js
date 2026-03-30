const mongoose = require("mongoose");

const savedResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "Untitled Resume",
    },
    template: {
      type: String,
      default: "template1",
    },
    resumeData: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedResume", savedResumeSchema);
