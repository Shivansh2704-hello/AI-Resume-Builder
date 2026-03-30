const SavedResume = require("../models/SavedResume");

// @desc    Save or Update a Resume Configuration
// @route   POST /api/resume/save
// @access  Private
exports.saveResume = async (req, res) => {
  try {
    const { title, template, resumeData } = req.body;

    const newResume = new SavedResume({
      userId: req.user, // Inherited from authMiddleware JWT
      title: title || "My Saved Resume",
      template: template || "template1",
      resumeData,
    });

    await newResume.save();
    res.status(201).json({ message: "Resume saved to secure cloud successfully", resume: newResume });
  } catch (error) {
    console.error("Save Resume Error:", error);
    res.status(500).json({ message: "Server error saving resume pipeline" });
  }
};

// @desc    Get all Saved Resumes for Authenticated User
// @route   GET /api/resume/saved
// @access  Private
exports.getSavedResumes = async (req, res) => {
  try {
    // Isolated lookup mapped strictly to JWT payload ID
    const resumes = await SavedResume.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching portfolio records" });
  }
};

// @desc    Delete a specific Saved Resume
// @route   DELETE /api/resume/saved/:id
// @access  Private
exports.deleteSavedResume = async (req, res) => {
  try {
    const resume = await SavedResume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume structural file not found" });
    }

    // Security constraints validating DB ownership mapping to Token
    if (resume.userId.toString() !== req.user) {
      return res.status(401).json({ message: "User securely locked out from deleting unowned resources." });
    }

    await resume.deleteOne();
    res.json({ message: "Historical draft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Database violation error deleting record" });
  }
};
