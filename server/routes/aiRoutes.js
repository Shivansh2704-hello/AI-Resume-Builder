const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { chatWithAI, generateOptimizedResume } = require("../controllers/aiController");

router.post("/chat", chatWithAI);
router.post("/generate-resume", upload.single("resume"), generateOptimizedResume);

module.exports = router;