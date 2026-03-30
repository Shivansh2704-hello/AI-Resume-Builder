import { useState } from "react";
import axios from "axios";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const res = await axios.post(url, form);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      } else {
        alert("Registered successfully! Now login.");
        setIsLogin(true);
      }

    } catch (err) {
      alert("Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">

      <div className="bg-[#0f172a] p-8 rounded-2xl w-full max-w-md shadow-[0_0_30px_rgba(99,102,241,0.2)]">

        {/* Toggle */}
        <div className="flex mb-6 bg-[#1e293b] rounded-lg">
          <button
            className={`w-1/2 py-2 rounded-lg ${
              isLogin ? "bg-indigo-600" : ""
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={`w-1/2 py-2 rounded-lg ${
              !isLogin ? "bg-indigo-600" : ""
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {/* Name (only for register) */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 p-3 rounded-lg bg-[#1e293b]"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg bg-[#1e293b]"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded-lg bg-[#1e293b]"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 rounded-lg hover:scale-105 transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>

      </div>
    </div>
  );
}

export default Auth;