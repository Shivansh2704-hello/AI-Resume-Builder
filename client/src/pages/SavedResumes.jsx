import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Edit3, Loader2, FileText, Database } from "lucide-react";
import axios from "axios";

function SavedResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSavedResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://localhost:5000/api/resume/saved", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(res.data);
    } catch (error) {
      console.error("Error fetching saved resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedResumes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this saved resume draft?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/resume/saved/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(resumes.filter(r => r._id !== id));
    } catch (error) {
      console.error("Failed to delete database draft", error);
      alert("Error deleting resume layout.");
    }
  };

  const handleLoad = (resume) => {
    // Navigating dynamically pushing the structured Mongoose JSON cache back into the pure React component loader
    navigate("/create", { state: { importedResume: resume.resumeData, importedTemplate: resume.template } });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="text-indigo-500" /> Cloud Saved Resumes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage, load, or iterate on your saved multi-version ATS resume drafts directly tied to your account securely.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20 text-indigo-500 font-bold gap-3">
             <Loader2 className="animate-spin" size={32} /> Syncing Storage Graph...
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white dark:bg-[#0f172a]/60 backdrop-blur-md p-10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700/50 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Saved Resumes Yet</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">Looks like you haven't published any resumes to the cloud yet. Create a draft in the Builder and hit "Save to Cloud"!</p>
            <Link to="/create" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25">
              Build a Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="bg-white dark:bg-[#0f172a]/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                <div className="p-6 flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate">{resume.title}</h3>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                      {resume.template === "template1" ? "Classic Profile" : "Modern Profile"}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Last Modified: {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/30 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <button 
                    onClick={() => handleLoad(resume)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-bold shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} /> Load Draft
                  </button>
                  <button 
                    onClick={() => handleDelete(resume._id)}
                    className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/30 p-2 rounded-xl transition-all"
                    title="Delete permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SavedResumes;
