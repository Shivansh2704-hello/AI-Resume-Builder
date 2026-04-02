import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`, form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-200">
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 dark:opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 dark:opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_0_40px_rgba(99,102,241,0.1)] transition-colors duration-200">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-600 dark:from-purple-400 dark:to-blue-500">
              Create Account
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Join the AI Resume Builder platform</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-500 text-sm p-3 rounded-xl mb-6 text-center">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Creating account..." : "Register Now"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;