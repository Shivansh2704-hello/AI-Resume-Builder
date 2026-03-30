const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    
    const prompt = `You are an expert ATS Resume Optimization Assistant. Give concise, actionable advice based on the ATS results below:\n\n${message}`;
    
    const result = await aiModel.generateContent(prompt);
    const text = await result.response.text();

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

    const prompt = `You are an expert Resume Writer and ATS Optimizer. 
I have a resume and a target job description. 
Rewrite the entire resume to score perfectly against the job description. 
Focus on seamlessly integrating missing keywords, using strong action verbs, and quantifying bullet points where possible. Do not hallucinate experiences, just reword and emphasize existing skills.
Return ONLY the newly generated professional resume in plain text format so the user can copy or paste it directly. Do not include introductory conversational text.

----- TARGET JOB DESCRIPTION -----
${jobDescription}

----- CURRENT RESUME -----
${resumeText}`;

    const result = await aiModel.generateContent(prompt);
    const text = await result.response.text();

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