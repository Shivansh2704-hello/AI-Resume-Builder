const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fallbackAI(message) {
  message = message.toLowerCase();

  if (message.includes("increase")) {
    return "To increase your ATS score, add missing keywords from the job description, use strong action verbs, and include measurable achievements.";
  }

  if (message.includes("weak")) {
    return "Avoid phrases like 'worked on' or 'responsible for'. Use impact-driven statements like 'Developed', 'Optimized', or 'Led'.";
  }

  return "Focus on keyword alignment, quantified achievements, and proper resume structure for better ATS performance.";
}

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    const prompt = `You are a world-class AI Career Coach and ATS Expert. 
Based on the following resume data and job description, provide 3-5 high-impact, actionable improvements to increase the ATS score.
Focus on:
1. Identifying missing high-priority technical skills.
2. Rewording weak "responsible for" bullet points into impact-driven achievements.
3. Improving keyword density without "stuffing".

----- CONTEXT DATA -----
${message}
-----------------------

Return your response in clean Markdown with professional, encouraging tone.`;
    
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      reply: text
    });

  } catch (error) {
    console.log("Gemini SDK unavailable. Using fallback. Error:", error.message);

    res.json({
      reply: fallbackAI(req.body.message),
      debugError: error.message
    });
  }
};

exports.generateOptimizedResume = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    if (!file || !jobDescription) {
      return res.status(400).json({ message: "Resume file and Job Description required" });
    }

    let resumeText = "";
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      resumeText = data.text;
    } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      resumeText = result.value;
    } else {
      return res.status(400).json({ message: "Only PDF or DOCX files allowed" });
    }

    const prompt = `You are an elite Professional Resume Writer. 
Your task is to rewrite the provided resume to be perfectly optimized for the target job description while maintaining 100% honesty.

GUIDELINES:
- Use standard, clean resume headings (Professional Summary, Experience, Skills, Education).
- Use the "X-Y-Z Formula" (Accomplished [X] as measured by [Y], by doing [Z]) for all bullet points.
- Naturally integrate high-value keywords from the Job Description into the skills and experience sections.
- Ensure the tone is professional, confident, and direct.
- Return ONLY the newly rewritten resume in a clean, professional layout (standard text or Markdown). Do NOT include any introductory or closing remarks.

----- TARGET JOB DESCRIPTION -----
${jobDescription}

----- CURRENT RESUME TEXT -----
${resumeText}`;

    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      generatedResume: text
    });

  } catch (error) {
    console.error("GENERATE RESUME ERROR:", error.message);
    
    if (error.message.includes("quota") || error.message.includes("429") || error.message.includes("403")) {
      return res.json({
        generatedResume: `[MOCK GENERATED RESUME - GEMINI QUOTA EXCEEDED / API ERROR]\n\nYour Gemini API Key is currently out of quota, invalid, or rate-limited. We've returned this fallback text to show you that the tool structure is working perfectly!\n\nOnce you verify your Google API billing (or switch valid API keys), this will automatically be replaced by the deeply optimized actual resume.\n\n----- AUTOMATICALLY DERIVED SKILLS -----\n- ATS Optimization\n- React & Node.js Integrations\n- API Resilience & Fallbacks\n\n----- TARGET ALIGNMENT -----\nWe successfully processed your Target JD and extracted your source resume text successfully. We are just waiting for Gemini permission to synthesize it!`
      });
    }

    res.status(500).json({ message: "Server error generating resume", details: error.message });
  }
};