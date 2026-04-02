import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertCircle, FileText, Calendar, Target } from "lucide-react";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/ats/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      setError("Failed to fetch reports. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/ats/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports((prev) => prev.filter((report) => report._id !== id));
    } catch (err) {
      alert("Failed to delete report.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-500">
            My Analysis History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">View and manage your previous resume matches against job descriptions.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-500 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-500"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-md p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center transition-colors">
            <FileText size={48} className="text-slate-400 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-300">No Reports Found</h3>
            <p className="text-slate-500 mt-2">You haven't run any ATS analyses yet. Upload a resume on the Analyze page to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {reports.map((report, index) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg group hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-colors relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 p-4">
                     <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-2 ${
                        report.score >= 80 ? 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10' : 
                        report.score >= 50 ? 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10' : 
                        'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10'
                      }`}>
                        {report.score}%
                      </div>
                  </div>

                  <div className="pr-16 space-y-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                      <Calendar size={14} />
                      {report.createdAt ? formatDate(report.createdAt) : "Recently"}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-medium mb-1">
                        <Target size={16} /> Target Job Snippet
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm line-clamp-2">
                        {report.jobDescription || "No job description provided."}
                      </p>
                    </div>

                    {report.suggestion && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-500/10">
                        <p className="text-indigo-800 dark:text-indigo-200/80 text-xs line-clamp-2 italic">
                          " {report.suggestion} "
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="text-slate-500 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                      title="Delete this report"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Reports;