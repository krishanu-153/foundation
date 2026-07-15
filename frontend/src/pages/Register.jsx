import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await registerUser(form);
      toast.success(data.message || "Registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section max-w-md">
      <h1 className="section-title text-center">Create an Account</h1>
      <p className="section-subtitle text-center mx-auto">Join us to track your donations, volunteer status, and event registrations.</p>
      <form onSubmit={handleSubmit} className="card p-8 space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input required type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input required type={showPassword ? "text" : "password"} minLength={6} className="input pr-11" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-primary-600" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating account..." : "Register"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-primary-600 font-medium">Log In</Link>
        </p>
      </form>
    </div>
  );
}
