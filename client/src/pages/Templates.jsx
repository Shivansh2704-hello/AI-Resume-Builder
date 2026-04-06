import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Bot, Loader2, Sparkles, Target, Download, Copy, Check } from "lucide-react";

function Templates() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return "guest";
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload).id;
    } catch (e) {
        return "guest";
    }
  };

  const storageKey = `generatedResume_${getUserIdFromToken()}`;

  const [generatedResume, setGeneratedResume] = useState(() => {
    return localStorage.getItem(storageKey) || "";
  });

  useEffect(() => {
    if (generatedResume) {
      localStorage.setItem(storageKey, generatedResume);
    }
  }, [generatedResume, storageKey]);

  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!file || !jobDesc) {
      alert("Please upload a resume file and paste a job description.");
      return;
    }

    try {
      setLoading(true);
      setGeneratedResume("");

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDesc);

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.post(`${API_URL}/api/ai/generate-resume`, formData);
      setGeneratedResume(res.data.generatedResume);
    } catch (error) {
      console.error("ERROR Generating:", error);
      alert("Error generating the optimized resume. Make sure your file is a valid PDF or DOCX.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([generatedResume], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = "Optimized_Resume.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-400 dark:to-rose-400 flex items-center gap-3">
            <Sparkles className="text-pink-500 dark:text-pink-400" />
            AI Resume Generator
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Upload your resume and the target JD. Our AI will automatically rewrite your resume to score perfectly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden group transition-all hover:border-pink-300 dark:hover:border-pink-500/30"
          >
            <input type="file" id="fileUploadTpl" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="fileUploadTpl" className="cursor-pointer flex flex-col items-center w-full z-10">
              <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 flex items-center justify-center mb-4 text-pink-500 dark:text-pink-400 group-hover:scale-110 group-hover:bg-pink-100 dark:group-hover:bg-pink-500/20 transition-all">
                <UploadCloud size={32} />
              </div>
              <p className="text-slate-800 dark:text-slate-300 font-medium text-lg mb-2">Upload Current Resume</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm mb-6">PDF & DOCX Support</p>
            </label>
            {file && (
              <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-600/20 text-pink-600 dark:text-pink-300 px-4 py-2 rounded-lg border border-pink-200 dark:border-pink-500/30 w-full justify-center">
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
              <Target size={18} className="text-rose-500 dark:text-rose-400" />
              Target Job Description
            </div>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the target job description here..."
              className="w-full h-48 bg-slate-50 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none"
            />
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={loading || !file || !jobDesc}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800 disabled:text-slate-500 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] active:scale-95 disabled:shadow-none disabled:active:scale-100 flex items-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Bot size={20} />}
            {loading ? "Generating Perfect Resume..." : "Generate Optimized Resume"}
          </button>
        </motion.div>

        {/* RESULTS SECTION */}
        <AnimatePresence>
          {generatedResume && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <FileText className="text-pink-500 dark:text-pink-400" /> Your New Optimized Resume
                </h2>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium transition-colors text-slate-700 dark:text-white"
                  >
                    {copied ? <Check size={16} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-pink-600/20 hover:bg-pink-100 dark:hover:bg-pink-600/30 border border-pink-200 dark:border-pink-500/30 text-pink-600 dark:text-pink-400 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download size={16} /> Download .TXT
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#1e293b]/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-inner">
                <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  {generatedResume}
                </pre>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

export default Templates;
