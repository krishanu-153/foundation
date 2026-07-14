import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Images,
  HandCoins,
  Users,
  Newspaper,
  MessageSquareQuote,
  Mail,
  Settings,
  LogOut,
  Heart,
  HeartHandshake,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/donations", label: "Donations", icon: HandCoins },
  { to: "/admin/volunteers", label: "Volunteers", icon: Users },
  { to: "/admin/causes", label: "Causes", icon: HeartHandshake },
  { to: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/messages", label: "Contact Messages", icon: Mail },
  { to: "/admin/homepage", label: "Homepage CMS", icon: Settings },
  { to: "/admin/profile", label: "Profile", icon: UserCircle },
];

export default function AdminLayout() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-gray-900 text-gray-300 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6 text-white">
          <div className="flex items-center gap-2 font-bold">
            <Heart className="h-5 w-5 fill-primary-500 text-primary-500" />
            Admin Panel
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-300 hover:bg-gray-800 hover:text-white lg:hidden"
            onClick={closeSidebar}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary-600 text-white" : "hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-800 p-3">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600">
              <UserCircle className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="truncate text-sm font-semibold text-white">{admin?.name}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Open sidebar"
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Heart className="h-4 w-4 fill-primary-500 text-primary-500" />
                Admin
              </div>
              <LanguageToggle />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-5 hidden justify-end lg:flex">
            <LanguageToggle />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
