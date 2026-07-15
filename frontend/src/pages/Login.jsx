import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginUser(form.email, form.password);
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section max-w-md">
      <h1 className="section-title text-center">Welcome Back</h1>
      <p className="section-subtitle text-center mx-auto">Log in to track your donations, events, and volunteer status.</p>
      <form onSubmit={handleSubmit} className="card p-8 space-y-4">
        <div>
          <label className="label">Email</label>
          <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input required type={showPassword ? "text" : "password"} className="input pr-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-primary-600" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-primary-600">Forgot password?</Link>
        </div>
        <button disabled={submitting} className="btn-primary w-full">
          {submitting ? "Logging in..." : "Log In"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Don't have an account? <Link to="/register" className="text-primary-600 font-medium">Register</Link>
        </p>
      </form>
    </div>
  );
}
