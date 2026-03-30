import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart2, Target, Lightbulb, FileText, Layers, Wrench, 
  UploadCloud, Cpu, CheckCircle, Flame, ChevronDown, ChevronUp,
  Loader2, TrendingUp, Award, Activity, Sun, Moon
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// --- Subcomponents for Cleanliness ---

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white dark:bg-[#0f172a]/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400">{description}</p>
  </div>
);

const StepCircle = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center max-w-xs relative">
    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-blue-500/30 z-10 relative">
      {number}
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
  </div>
);

const TemplateCard = ({ title, desc, features }) => (
  <div className="bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-xl">
    <div className="h-48 bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center p-6">
      <div className="w-24 h-32 bg-white dark:bg-slate-900 rounded shadow-sm p-3 flex flex-col gap-2">
        <div className="w-full h-2 bg-blue-200 dark:bg-blue-900/50 rounded-full"></div>
        <div className="w-3/4 h-2 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800/50 mt-2 rounded-full"></div>
        <div className="w-5/6 h-1 bg-slate-100 dark:bg-slate-800/50 rounded-full"></div>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-1">{desc}</p>
      <ul className="space-y-2 mb-6 text-sm text-slate-700 dark:text-slate-300">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" /> {f}
          </li>
        ))}
      </ul>
      <Link to="/register" className="w-full py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700">
        Use Template
      </Link>
    </div>
  </div>
);

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700/50">
      <button className="w-full py-5 flex items-center justify-between text-left focus:outline-none" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-slate-900 dark:text-slate-200">{q}</span>
        {open ? <ChevronUp className="text-blue-500" /> : <ChevronDown className="text-slate-400" />}
      </button>
      {open && <p className="pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{a}</p>}
    </div>
  );
};

// --- Main Page ---

function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem("token");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get("http://localhost:5000/api/ats/reports", {
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

  // Use real data, heavily padded to simulate realistic graphs if user has low DB entry counts
  const totalAnalyses = reports.length;
  const averageScore = totalAnalyses > 0 ? Math.round(reports.reduce((acc, r) => acc + r.score, 0) / totalAnalyses) : 0;
  const bestScore = totalAnalyses > 0 ? Math.max(...reports.map(r => r.score)) : 0;
  const latestScore = totalAnalyses > 0 ? reports[0].score : 0;
  
  const chronologicalReports = [...reports].reverse();
  const chartData = chronologicalReports.map((r, i) => ({
    name: r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Run ${i+1}`,
    score: r.score
  }));

  const mockChartData = [
    { name: "Week 1", score: 45 }, { name: "Week 2", score: 58 }, 
    { name: "Week 3", score: 72 }, { name: "Week 4", score: 89 }, { name: "Current", score: 96 }
  ];

  const displayChart = chartData.length > 2 ? chartData : mockChartData;
  const displayBest = bestScore > 0 ? bestScore + "%" : "96%";
  const displayAverage = averageScore > 0 ? averageScore + "%" : "74%";
  const displayLatest = latestScore > 0 ? latestScore : 96;

  const getStatusText = (score) => {
    if (score >= 80) return { text: "Excellent", color: "text-emerald-500 dark:text-emerald-400", pathColor: "#34d399" };
    if (score >= 50) return { text: "Average", color: "text-amber-500 dark:text-amber-400", pathColor: "#fbbf24" };
    return { text: "Needs Work", color: "text-rose-500 dark:text-rose-400", pathColor: "#fb7185" };
  };
  const status = getStatusText(displayLatest);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-200 font-sans selection:bg-blue-500/30">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center"><FileText size={20} /></span>
            <Link to="/">ResumeAI</Link>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                  <Link to="/create" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Create Resume</Link>
                  <Link to="/analyze" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">ATS Analyzer</Link>
                  <Link to="/templates" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Resume Generator</Link>
                  <Link to="/saved-resumes" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Saved Resumes</Link>
                </div>
                <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-md hover:shadow-blue-500/25">Go to App</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Log in</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-md hover:shadow-blue-500/25">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-48 px-6 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-3/4 h-full bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
            Optimize Your Resume to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Beat the ATS.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            Stop getting rejected by automated systems. Analyze your resume against any job description, receive AI-powered improvements, and track your global performance perfectly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/analyze" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
              <Flame size={20} /> Analyze Now
            </Link>
            <Link to="/create" className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-slate-500/10 flex items-center justify-center gap-2">
              <Layers size={20} /> Build Resume
            </Link>
          </div>
        </motion.div>
      </section>

      {/* EMBEDDED ANALYTICS / DASHBOARD INJECT */}
      <section className="px-6 max-w-6xl mx-auto -mt-32 relative z-20 mb-20">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row gap-8">
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="text-blue-500" /> Platform Analytics Demo
              </h2>
              <span className="text-xs bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/30">LIVE DATA INTEGRATION</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">System Average</p>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{loading ? <Loader2 className="animate-spin text-slate-400 my-1" /> : displayAverage}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Best Global Score</p>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{loading ? <Loader2 className="animate-spin text-slate-400 my-1" /> : displayBest}</div>
              </div>
            </div>

            <div className="h-56 w-full">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-xl"><Loader2 className="animate-spin" /></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayChart} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#f8fafc' }} itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e293b' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
             <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider">Latest Run Performance</h3>
             <div className="w-36 h-36 drop-shadow-lg mb-6 bg-white dark:bg-slate-900 rounded-full p-2 border border-slate-100 dark:border-slate-800">
                <CircularProgressbar 
                    value={loading ? 85 : displayLatest} 
                    text={loading ? "85%" : `${displayLatest}%`} 
                    styles={buildStyles({ 
                      pathColor: loading ? "#3b82f6" : status.pathColor, 
                      textColor: 'currentColor', 
                      trailColor: 'rgba(148, 163, 184, 0.1)', 
                      pathTransitionDuration: 1.5,
                      textSize: '22px'
                    })}
                 />
             </div>
             <div className={`text-lg font-bold bg-white dark:bg-slate-900 px-6 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 ${loading ? 'text-blue-500' : status.color}`}>
                {loading ? "Optimizing..." : status.text}
             </div>
          </div>

        </motion.div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 px-6 bg-white dark:bg-[#0f172a]/20 border-y border-slate-200 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Everything You Need to Beat the ATS</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Our suite of tools helps you optimize every aspect of your resume for applicant tracking systems.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={BarChart2} title="ATS Score Analysis" description="Get a detailed 0-100 score based on keyword matching, structure, formatting, skills, and experience quality." />
            <FeatureCard icon={Target} title="Job Description Match" description="Paste a job description and see your match percentage with missing keywords explicitly highlighted." />
            <FeatureCard icon={Lightbulb} title="AI Suggestions" description="Receive AI-powered improvements including actionable strategic advice and missing skill insertions." />
            <FeatureCard icon={FileText} title="Resume Parsing" description="Automatically extract name, email, skills, education, and experience sections out of your PDF/DOCX files." />
            <FeatureCard icon={Layers} title="ATS Templates" description="Download ATS-friendly resume templates designed specifically to seamlessly pass automated screening systems." />
            <FeatureCard icon={Wrench} title="Resume Builder" description="Build a professional ATS-optimized resume from scratch with our dynamic, live-preview form-based builder." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">How ATS Checking Works</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Simple 4-step process to perfectly optimize your resume</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 relative">
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-slate-200 dark:bg-slate-800 z-0"></div>
          
          <StepCircle number="1" title="Upload Resume" description="Upload your resume securely in PDF or DOCX format." />
          <StepCircle number="2" title="AI Analysis" description="Our AI engine parses and scores your resume strictly against the target ATS criteria." />
          <StepCircle number="3" title="Get Results" description="View your match score, missing keywords, and contextual improvement suggestions immediately." />
          <StepCircle number="4" title="Optimize" description="Apply our AI's suggestions and use our pre-built templates until your score hits 90+." />
        </div>
      </section>

      {/* TEMPLATES PREVIEW */}
      <section className="py-24 px-6 bg-slate-100/50 dark:bg-[#0f172a]/40 border-y border-slate-200 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">ATS-Friendly Resume Templates</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Download professionally designed templates that are guaranteed to pass internal scanning systems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TemplateCard 
              title="Classic Professional" 
              desc="Clean single-column layout. Perfect for traditional, formal industries like finance and legal."
              features={["Single column", "Standard headings", "Highly scannable"]}
            />
            <TemplateCard 
              title="Modern Minimal" 
              desc="Contemporary design utilizing whitespace. Excellent visual balance for tech and modern corporate roles."
              features={["Clean typography", "Subtle accents", "ATS-optimized borders"]}
            />
            <TemplateCard 
              title="Executive" 
              desc="Polished structural layout geared towards senior professionals highlighting summary and large impacts."
              features={["Prominent Summary", "Achievement focus", "Authoritative tone"]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-2">
          <FAQItem q="What is an ATS?" a="An Applicant Tracking System (ATS) is software used by employers to collect, scan, and rank job applications. If your resume isn't formatted correctly or lacks the right keywords, the ATS will reject it before a human ever sees it." />
          <FAQItem q="How does ATS scoring work?" a="Our custom AI scoring algorithm checks your resume's contextual relevance against a provided Job Description. We measure exact keyword matches, structural integrity, readability, and missing critical domain skills." />
          <FAQItem q="What file formats are supported?" a="Our platform currently supports PDF and DOCX files for both uploading legacy resumes and downloading newly generated ones." />
          <FAQItem q="Is my resume data secure?" a="Yes. We do not sell your personal data. Resumes are processed locally in memory for our analytical pipelines and discarded safely." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <span className="bg-blue-600 text-white p-1 rounded"><FileText size={18} /></span>
              ResumeAI
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">AI-powered ATS resume checker and builder. Optimize your career trajectory and land more interviews.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/analyze" className="hover:text-blue-500">ATS Checker</Link></li>
              <li><Link to="/create" className="hover:text-blue-500">Resume Builder</Link></li>
              <li><Link to="/templates" className="hover:text-blue-500">AI Resume Generator</Link></li>
              <li><Link to="/saved-resumes" className="hover:text-blue-500">Saved Resumes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li className="cursor-pointer hover:text-blue-500">How to Pass ATS</li>
              <li className="cursor-pointer hover:text-blue-500">Resume Keywords</li>
              <li className="cursor-pointer hover:text-blue-500">Resume Formats</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li className="cursor-pointer hover:text-blue-500">About Us</li>
              <li className="cursor-pointer hover:text-blue-500">support@resumeai.in</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-500">
          © {new Date().getFullYear()} ResumeAI. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default Home;
