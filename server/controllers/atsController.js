const { calculateATSScore } = require("../services/atsService");
const ATSReport = require("../models/ATSReport");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.analyzeUploadedResume = async (req, res) => {
  console.log("🔥 API HIT 🔥");

  try {
    console.log("FILE:", req.file);
    console.log("JOB DESC:", req.body.jobDescription);

    const file = req.file;
    const { jobDescription } = req.body;

    // ✅ Validation
    if (!file || !jobDescription) {
      return res.status(400).json({
        message: "Resume file and Job Description required",
      });
    }

    let resumeText = "";

    // ✅ PDF Handling (SAFE)
    if (file.mimetype === "application/pdf") {
      try {
        const data = await pdfParse(file.buffer);
        resumeText = data.text;
      } catch (err) {
        console.error("PDF PARSE ERROR:", err);
        return res.status(500).json({
          message: "Error reading PDF file",
        });
      }
    }

    // ✅ DOCX Handling
    else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const result = await mammoth.extractRawText({
          buffer: file.buffer,
        });
        resumeText = result.value;
      } catch (err) {
        console.error("DOCX PARSE ERROR:", err);
        return res.status(500).json({
          message: "Error reading DOCX file",
        });
      }
    }

    // ❌ Invalid file type
    else {
      return res.status(400).json({
        message: "Only PDF or DOCX files allowed",
      });
    }

    // ✅ ATS Score Calculation (Keyword Matching)
    const result = calculateATSScore(resumeText, jobDescription);

    // ✅ AI Semantic Analysis (Enhanced Insights)
    let aiSuggestion = result.suggestion;

    try {
      const prompt = `You are a high-level ATS (Applicant Tracking System) Scanner. 
Analyze the provided RESUME against the JOB DESCRIPTION.
Give a concise explanation (2-3 sentences) of how well the candidate's actual EXPERIENCE (not just keywords) matches the role.
Highlight 1 major strength and 1 major gap.

----- RESUME -----
${resumeText.substring(0, 4000)}

----- JOB DESCRIPTION -----
${jobDescription.substring(0, 2000)}

Return ONLY the concise analysis text.`;

      const aiResult = await aiModel.generateContent(prompt);
      const aiResponse = await aiResult.response;
      aiSuggestion = aiResponse.text();
    } catch (aiErr) {
      console.warn("AI ATS Analysis failed, falling back to basic suggestion.", aiErr.message);
    }

    // ✅ Save to DB
    const report = new ATSReport({
      userId: req.user,
      resumeText,
      jobDescription,
      score: result.score,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      suggestion: aiSuggestion, // Use AI suggestion if available
    });

    await report.save();

    // ✅ Response
    res.json({
      message: "Resume uploaded & analyzed successfully ✅",
      score: result.score,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      suggestion: aiSuggestion, // Improved AI-driven suggestion
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET ALL REPORTS FOR SPECIFIC USER
exports.getReports = async (req, res) => {
  try {
    const reports = await ATSReport.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("GET REPORT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE REPORT
exports.deleteReport = async (req, res) => {
  try {
    const report = await ATSReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Validate ownership before authorizing deletion
    if (report.userId.toString() !== req.user) {
      return res.status(401).json({ message: "User not authorized to delete this specific report" });
    }

    await report.deleteOne();
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("DELETE REPORT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};