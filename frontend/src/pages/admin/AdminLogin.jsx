import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginAdmin(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-5 mb-10">
          <img
            src="/logoCreator_imagetologo.jpg"
            alt="Sadhana Foundation"
            className="w-36 h-36 object-contain"
          />

          <div className="leading-tight">
            <h1 className="text-4xl font-bold text-white font-serif">
              Sadhana Foundation
            </h1>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-xl font-semibold mb-1 text-center">Admin Login</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Secure access to the admin dashboard</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input required type="email" className="input border-black/25" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input required type={showPassword ? "text" : "password"} className="input border-black/25 pr-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-primary-600" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button disabled={submitting} className="btn-primary w-full">
              {submitting ? "Logging in..." : "Log In"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-outline w-full mt-3"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
