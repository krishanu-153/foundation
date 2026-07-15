import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { HandCoins, CalendarCheck, HeartHandshake, LogOut } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Spinner, EmptyState } from "../components/Ui.jsx";

const statusColors = {
  not_applied: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const { user, setUser, logoutUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: "" });

  useEffect(() => {
    api
      .get("/users/dashboard")
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/users/profile", profileForm);
      setUser(data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Spinner className="min-h-[50vh]" />;

  return (
    <div className="section">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Hi, <span className="notranslate" translate="no">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm">Here's an overview of your activity.</p>
        </div>
        <button onClick={logoutUser} className="btn-outline text-sm flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="admin-card">
          <div className="flex items-center gap-3 mb-2 text-primary-600"><HandCoins className="w-5 h-5" /><span className="font-medium">Donations</span></div>
          <p className="text-2xl font-bold">{data.donations.length}</p>
          <p className="text-sm text-gray-500">₹{data.donations.reduce((s, d) => s + d.amount, 0).toLocaleString("en-IN")} total given</p>
        </div>
        <div className="admin-card">
          <div className="flex items-center gap-3 mb-2 text-accent-600"><HeartHandshake className="w-5 h-5" /><span className="font-medium">Volunteer Status</span></div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[data.volunteer?.status || "not_applied"]}`}>
            {data.volunteer?.status ? data.volunteer.status : "Not Applied"}
          </span>
        </div>
        <div className="admin-card">
          <div className="flex items-center gap-3 mb-2 text-gray-700"><CalendarCheck className="w-5 h-5" /><span className="font-medium">Registered Events</span></div>
          <p className="text-2xl font-bold">{data.registeredEvents.length}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Donation History</h2>
          {data.donations.length === 0 ? (
            <EmptyState message="No donations yet." />
          ) : (
            <div className="space-y-3">
              {data.donations.map((d) => (
                <div key={d._id} className="admin-card flex justify-between items-center">
                  <div>
                    <p className="font-medium">₹{d.amount}</p>
                    <p className="text-xs text-gray-500">{format(new Date(d.createdAt), "dd MMM yyyy")} • {d.cause?.title || "General Fund"}</p>
                  </div>
                  <span className="text-xs text-gray-400">{d.receiptNumber}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Registered Events</h2>
          {data.registeredEvents.length === 0 ? (
            <EmptyState message="No event registrations yet." />
          ) : (
            <div className="space-y-3">
              {data.registeredEvents.map((e) => (
                <div key={e._id} className="admin-card">
                  <p className="font-medium">{e.name}</p>
                  <p className="text-xs text-gray-500">{format(new Date(e.date), "dd MMM yyyy")} • {e.venue}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
        <form onSubmit={handleProfileUpdate} className="card p-6 space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input notranslate" translate="no" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
          </div>
          <button className="btn-primary w-full">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
