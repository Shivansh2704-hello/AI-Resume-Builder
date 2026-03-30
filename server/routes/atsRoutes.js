const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const {
  analyzeUploadedResume,
  getReports,
  deleteReport
} = require("../controllers/atsController");

router.post("/upload-analyze", authMiddleware, upload.single("resume"), analyzeUploadedResume);

router.get("/reports", authMiddleware, getReports);
router.delete("/reports/:id", authMiddleware, deleteReport);

module.exports = router;