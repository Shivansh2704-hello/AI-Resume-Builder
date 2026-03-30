import Layout from "../components/Layout";
import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, XCircle, FileText, Bot, Loader2, Sparkles, Target } from "lucide-react";

function Analyze() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file || !jobDesc) {
      alert("Please upload a resume file and paste a job description.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setAiSuggestion("");

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDesc);

      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/ats/upload-analyze", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const atsData = res.data;
      setResult(atsData);

      // Now fetch AI Suggestion automatically
      setAiLoading(true);
      try {
        const aiPrompt = `I received an ATS match score of ${atsData.score}%. 
        My matched keywords are: ${atsData.matchedKeywords?.join(", ") || "none"}. 
        My missing keywords are: ${atsData.missingKeywords?.join(", ") || "none"}. 
        Provide a concise, 2-3 sentence strategic advice on exactly how to improve my resume for this specific job.`;
        
        const aiRes = await axios.post("http://localhost:5000/api/ai/chat", { message: aiPrompt });
        setAiSuggestion(aiRes.data.reply);
      } catch (aiErr) {
        console.error("AI Error:", aiErr);
        setAiSuggestion("Unable to fetch AI suggestions at this time. Please try adding the missing keywords manually.");
      } finally {
        setAiLoading(false);
      }

    } catch (error) {
      console.error("ERROR:", error);
      alert("Error connecting to the analysis server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            ATS Analyzer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Upload your resume and compare it against a target job description.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden group transition-all hover:border-indigo-300 dark:hover:border-indigo-500/30"
          >
            <input type="file" id="fileUpload" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center w-full z-10">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/30 transition-all">
                <UploadCloud size={32} />
              </div>
              <p className="text-slate-800 dark:text-slate-300 font-medium text-lg mb-2">Drop your resume here or Browse</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm mb-6">Supports PDF & DOCX</p>
            </label>
            {file && (
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-500/30 w-full justify-center">
                <FileText size={16} />
                <span className="truncate max-w-[200px]">{file.name}</span>
              </div>
            )}
          </motion.div>

          {/* Job Description */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-300 font-medium">
              <Target size={18} className="text-blue-500 dark:text-blue-400" />
              Target Job Description
            </div>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full h-48 bg-slate-50 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none"
            />
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading || !file || !jobDesc}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 disabled:text-slate-500 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] active:scale-95 disabled:shadow-none disabled:active:scale-100 flex items-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </motion.div>

        {/* RESULTS SECTION */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-8 overflow-hidden"
            >
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 flex items-center gap-3">
                Analysis Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Score Card */}
                <div className="bg-white/80 dark:bg-[#0f172a]/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center text-center shadow-lg transition-colors">
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-4">ATS Match Score</h3>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-200 dark:text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className={`${result.score >= 80 ? 'text-emerald-500' : result.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`} strokeDasharray={`${result.score}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-extrabold text-slate-800 dark:text-white">{result.score || 0}<span className="text-xl">%</span></span>
                    </div>
                  </div>
                  <p className="mt-4 font-medium text-lg">
                    {result.score >= 80 ? <span className="text-emerald-500 dark:text-emerald-400">Excellent Match</span> : 
                     result.score >= 50 ? <span className="text-amber-500 dark:text-amber-400">Moderate Match</span> : 
                     <span className="text-rose-500 dark:text-rose-400">Needs Improvement</span>}
                  </p>
                </div>

                {/* AI Suggestion Card */}
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 shadow-lg relative overflow-hidden transition-colors">
                  <div className="absolute -right-4 -top-4 text-indigo-500/10 dark:text-indigo-500/20">
                    <Bot size={120} />
                  </div>
                  <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-300 font-semibold mb-3 relative z-10">
                    <Sparkles size={20} /> AI Strategic Advice
                  </div>
                  <div className="relative z-10 text-lg leading-relaxed text-slate-700 dark:text-indigo-100/90 font-medium">
                    {aiLoading ? (
                      <div className="flex items-center gap-3 py-4">
                        <Loader2 className="animate-spin text-indigo-500 dark:text-indigo-400" />
                        Generating personalized strategies...
                      </div>
                    ) : (
                      aiSuggestion || result.suggestion || "No AI feedback available."
                    )}
                  </div>
                </div>

              </div>

              {/* Keywords Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white/80 dark:bg-[#0f172a]/60 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 shadow-lg">
                  <div className="flex items-center gap-2 mb-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={20} /> Matched Keywords
                  </div>
                  {result.matchedKeywords?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.map((k, i) => (
                        <span key={i} className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">
                          {k}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No matched keywords found.</p>
                  )}
                </div>

                <div className="bg-white/80 dark:bg-[#0f172a]/60 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/30 shadow-lg">
                  <div className="flex items-center gap-2 mb-4 font-semibold text-rose-600 dark:text-rose-400">
                    <XCircle size={20} /> Missing Keywords
                  </div>
                  {result.missingKeywords?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((k, i) => (
                        <span key={i} className="bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">
                          {k}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No missing keywords! Great job.</p>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

export default Analyze;