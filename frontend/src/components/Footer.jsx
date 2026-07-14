import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    api
      .get("/settings")
      .then(({ data }) => setSettings(data.settings))
      .catch(() => {});
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribing(true);
    try {
      await api.post("/newsletter/subscribe", { email });
      toast.success("Subscribed to our newsletter!");
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
            <img
              src="/logo.jpg"
              alt="Sadhana Foundation Logo"
              className="h-14 w-14 object-cover rounded-full"
            />
            Sadhana Foundation
          </div>
          <p className="text-sm text-gray-400">
            {settings?.ngoIntro ||
              "Empowering underserved communities through education, health, and welfare programs."}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary-400">About Us</Link></li>
            <li><Link to="/causes" className="hover:text-primary-400">Our Causes</Link></li>
            <li><Link to="/events" className="hover:text-primary-400">Events</Link></li>
            <li><Link to="/volunteer" className="hover:text-primary-400">Become a Volunteer</Link></li>
            <li><Link to="/blogs" className="hover:text-primary-400">Blogs & News</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              {settings?.address || "Howrah, West Bengal, India"}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              {settings?.phone || "+91-00000-00000"}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              {settings?.email || "contact@sadhanafoundation.org"}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Newsletter</h4>
          <form onSubmit={handleSubscribe} className="flex gap-2 mb-4">
            <input
              type="email"
              required
              placeholder="Your email"
              className="min-w-0 flex-1 rounded-lg px-3 py-2 text-sm text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button disabled={subscribing} className="btn-primary text-sm px-4 py-2 shrink-0">
              {subscribing ? "..." : "Join"}
            </button>
          </form>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-3">
            {settings?.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-primary-400"><Facebook className="w-5 h-5" /></a>
            )}
            {settings?.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-primary-400"><Instagram className="w-5 h-5" /></a>
            )}
            {settings?.socialLinks?.twitter && (
              <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-primary-400"><Twitter className="w-5 h-5" /></a>
            )}
            {settings?.socialLinks?.youtube && (
              <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-primary-400"><Youtube className="w-5 h-5" /></a>
            )}
          </div>
          <Link to="/admin/login" className="inline-block mt-6 text-md text-gray-500 hover:text-gray-300">
            Admin Login
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Sadhana Foundation. All rights reserved.
      </div>
    </footer>
  );
}
