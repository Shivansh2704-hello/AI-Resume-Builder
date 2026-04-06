import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

function Sidebar() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Could not fetch user profile details");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    };
    fetchUser();
  }, []);

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Resume", path: "/create" },
    { name: "ATS Analyzer", path: "/analyze" },
    { name: "My Reports", path: "/reports" },
    { name: "AI Resume Generator", path: "/templates" },
    { name: "Saved Resumes", path: "/saved-resumes" },
  ];

  return (
    <div className="w-64 bg-white dark:bg-[#020617] border-r border-slate-200 dark:border-gray-800 p-6 flex flex-col transition-colors duration-200 sticky top-0 h-screen">
      <Link to="/" className="text-xl font-bold mb-10 text-slate-900 dark:text-white block hover:text-indigo-500 transition-colors">
        ResumeAI
      </Link>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block p-3 rounded-lg transition-colors font-medium ${
              pathname === item.path
                ? "bg-indigo-600 outline-none text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b]"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      
      <div className="mt-6 space-y-3">
        <button 
          onClick={toggleTheme} 
          className="flex items-center justify-center gap-2 w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-sm"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        {userData && (
          <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm mt-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-lg">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userData.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate shadow-sm">{userData.email}</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="mt-2 w-full py-2 text-xs font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;