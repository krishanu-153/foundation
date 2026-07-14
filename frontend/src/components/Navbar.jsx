import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Heart, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/causes", label: "Our Causes" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/volunteer", label: "Volunteer" },
  { to: "/blogs", label: "Blogs" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl text-primary-700">
            <img
              src="/ngo.png"
              alt="Sadhana Foundation Logo"
              className="h-12 w-12 object-cover"
            />
            <span>Sadhana Foundation</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive ? "text-primary-600" : "text-gray-500 hover:text-primary-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle />
            <Link
              to={user ? "/dashboard" : "/login"}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-primary-600"
            >
              <User className="w-4 h-4" />
              {user ? user.name.split(" ")[0] : "Login"}
            </Link>
            <Link to="/donate" className="btn-primary text-sm px-4 py-2.5">
              Donate <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageToggle />
            <button aria-label="Toggle navigation menu" onClick={() => setOpen(!open)}>
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-stone-100 bg-white px-5 py-5 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block rounded-xl px-3 py-2.5 text-gray-700 font-semibold hover:bg-primary-50 hover:text-primary-700"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={user ? "/dashboard" : "/login"}
            className="block rounded-xl px-3 py-2.5 text-gray-700 font-semibold hover:bg-primary-50 hover:text-primary-700"
            onClick={() => setOpen(false)}
          >
            {user ? "My Dashboard" : "Login"}
          </Link>
          <Link to="/donate" className="btn-primary w-full" onClick={() => setOpen(false)}>
            Donate Now
          </Link>
        </div>
      )}
    </header>
  );
}
