const stopWords = [
    "with", "and", "for", "the", "this", "that",
    "have", "has", "had", "are", "was", "were",
    "from", "your", "you", "our", "their"
  ];
  
  const skillAliases = {
    "react": ["react.js", "reactjs", "frontend"],
    "node": ["node.js", "nodejs", "backend"],
    "javascript": ["js", "es6", "typescript", "ts"],
    "mongodb": ["mongo", "mongoose", "nosql"],
    "aws": ["amazon web services", "cloud", "ec2", "s3"],
    "python": ["django", "flask", "py"],
    "sql": ["postgresql", "mysql", "database", "db"],
    "docker": ["kubernetes", "k8s", "containerization"]
  };
  
  function normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
  }
  
  function semanticMatch(word, resumeWords) {
    if (resumeWords.includes(word)) return true;
  
    if (skillAliases[word]) {
      return skillAliases[word].some(alias =>
        resumeWords.includes(alias)
      );
    }
  
    return false;
  }
  
  function detectWeakSentences(text) {
    const weakWords = ["responsible", "worked", "helped", "did"];
    const sentences = text.split(".");
    return sentences.filter(sentence =>
      weakWords.some(word =>
        sentence.toLowerCase().includes(word)
      )
    );
  }
  
  function detectSections(text) {
    const sections = ["education", "experience", "skills", "projects"];
    return sections.filter(section =>
      text.toLowerCase().includes(section)
    );
  }
  
  function calculateATSScore(resumeText, jobDescription) {
  
    const resumeWords = normalizeText(resumeText);
    const jdWords = normalizeText(jobDescription);
  
    const uniqueJDWords = [...new Set(jdWords)];
  
    let matchedKeywords = [];
    let missingKeywords = [];
  
    uniqueJDWords.forEach(word => {
      if (semanticMatch(word, resumeWords)) {
        matchedKeywords.push(word);
      } else {
        missingKeywords.push(word);
      }
    });
  
    const score = Math.round(
      (matchedKeywords.length / uniqueJDWords.length) * 100
    );
  
    let suggestion;
  
    if (score < 50) {
      suggestion = "Your resume needs major improvement. Add missing skills and rewrite weak bullet points.";
    } else if (score < 75) {
      suggestion = "Good attempt. Add measurable achievements and missing technical keywords.";
    } else {
      suggestion = "Excellent! Resume is well optimized.";
    }
  
    const weakSentences = detectWeakSentences(resumeText);
    const detectedSections = detectSections(resumeText);
  
    return {
      score: score || 0,
      matchedKeywords,
      missingKeywords,
      weakSentences,
      detectedSections,
      suggestion
    };
  }
  
  module.exports = { calculateATSScore };