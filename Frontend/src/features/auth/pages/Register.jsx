import React, { useState } from "react";
import { Mail, Lock, User, UserPlus, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await handleRegister(formData);
      setSuccessMessage("Registration successful! Please verify your email and then login.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      setErrorMessage(msg);
      console.error("Register failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 selection:bg-red-500/30">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative">
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
          {/* Top Gradient Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 via-red-500 to-red-600"></div>

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 -rotate-3 group-hover:-rotate-6 transition-transform duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-gray-400 mt-2">Join our premium community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {successMessage && (
              <div className="rounded-md border border-emerald-400/40 bg-emerald-500/10 p-2 text-emerald-200 text-sm">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-red-200 text-sm">
                {errorMessage}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-red-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-red-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-red-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-red-600 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-red-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-red-400/20 transition-all duration-300 flex items-center justify-center group/btn shadow-[0_4px_15px_rgba(220,38,38,0.2)] mt-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
