import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";
import { Loader2, TrendingUp, Award, Activity, FileText } from "lucide-react";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/ats/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="animate-spin text-indigo-500" size={48} />
        </div>
      </Layout>
    );
  }

  // Calculate Metrics
  const totalAnalyses = reports.length;
  const averageScore = totalAnalyses > 0 ? Math.round(reports.reduce((acc, r) => acc + r.score, 0) / totalAnalyses) : 0;
  const bestScore = totalAnalyses > 0 ? Math.max(...reports.map(r => r.score)) : 0;
  
  // Chronological data for charts (API returns newest first)
  const chronologicalReports = [...reports].reverse();
  const chartData = chronologicalReports.map((r, i) => ({
    name: r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Run ${i+1}`,
    score: r.score
  }));

  const latestScore = totalAnalyses > 0 ? reports[0].score : 0;
  const oldestScore = totalAnalyses > 0 ? chronologicalReports[0].score : 0;
  const improvement = latestScore - oldestScore;
  const improvementDisplay = improvement >= 0 ? `+${improvement}%` : `${improvement}%`;

  const getStatusText = (score) => {
    if (score >= 80) return { text: "Excellent", color: "text-emerald-500 dark:text-emerald-400", pathColor: "#34d399" };
    if (score >= 50) return { text: "Average", color: "text-amber-500 dark:text-amber-400", pathColor: "#fbbf24" };
    return { text: "Needs Work", color: "text-rose-500 dark:text-rose-400", pathColor: "#fb7185" };
  };

  const status = getStatusText(latestScore);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto pb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
            Welcome to your Dashboard 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Here is an overview of your AI Resume Builder analytics.</p>
        </motion.div>

        {totalAnalyses === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-md p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center transition-colors">
            <Activity size={48} className="text-slate-400 dark:text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-300">No Analytics Available Yet</h3>
            <p className="text-slate-500 mt-2 text-lg">Head over to the Analyzer to generate your first ATS score report!</p>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg flex items-center gap-4 group hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all">
                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-500 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-all">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Analyses</p>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{totalAnalyses}</h2>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg flex items-center gap-4 group hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-500 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-all">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Average Score</p>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{averageScore}%</h2>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg flex items-center gap-4 group hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-all">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-500 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-all">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Best Score</p>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{bestScore}%</h2>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg flex items-center gap-4 group hover:border-purple-300 dark:hover:border-purple-500/30 transition-all">
                <div className={`p-4 rounded-xl transition-all group-hover:scale-110 ${improvement >= 0 ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20'}`}>
                  <TrendingUp size={24} className={improvement < 0 ? 'rotate-180 transform' : ''} />
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Improvement</p>
                  <h2 className={`text-3xl font-bold mt-1 ${improvement >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
                    {improvementDisplay}
                  </h2>
                </div>
              </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart */}
              <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">ATS Score History</h2>
                  <div className="text-xs font-medium px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-500/20">
                    Chronological
                  </div>
                </div>
                
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#f8fafc' }}
                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#818cf8" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#818cf8', strokeWidth: 2, stroke: '#1e293b' }} 
                        activeDot={{ r: 6, fill: '#818cf8', stroke: '#c7d2fe' }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Circular Score & Status */}
              <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 p-4">
                  <Activity size={24} className="text-slate-300 dark:text-slate-600/50" />
                </div>
                
                <h2 className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-6">Latest ATS Score</h2>
                
                <div className="w-48 h-48 mb-6 drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                  <CircularProgressbar 
                    value={latestScore} 
                    text={`${latestScore}%`} 
                    styles={buildStyles({
                      pathColor: status.pathColor,
                      textColor: 'currentColor', // Relies on parent color or svg injection if possible
                      trailColor: 'rgba(148, 163, 184, 0.2)', // flexible slate-400 tracking
                      textSize: '24px',
                      pathTransitionDuration: 1.5,
                    })}
                    className="text-slate-900 dark:text-white"
                  />
                </div>
                
                <div className={`text-xl font-bold bg-slate-50 dark:bg-slate-800/50 px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700 ${status.color}`}>
                  {status.text}
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;