const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { saveResume, getSavedResumes, deleteSavedResume } = require("../controllers/resumeController");

// Mount REST operations protecting paths intrinsically using Auth Gateway
router.post("/save", authMiddleware, saveResume);
router.get("/saved", authMiddleware, getSavedResumes);
router.delete("/saved/:id", authMiddleware, deleteSavedResume);

module.exports = router;
