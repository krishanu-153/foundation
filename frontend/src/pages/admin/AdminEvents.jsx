import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import { Spinner, EmptyState } from "../../components/Ui.jsx";
import Modal from "../../components/admin/Modal.jsx";

const emptyForm = {
  name: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  organizer: "Sadhana Foundation",
  category: "Other",
  registrationLimit: 0,
  status: "draft",
};

const categories = ["Blood Donation", "Tree Plantation", "Health Camp", "Education", "Food Distribution", "Awareness", "Other"];

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchEvents = () => {
    setLoading(true);
    api.get("/events/admin/all").then(({ data }) => setEvents(data.events)).finally(() => setLoading(false));
  };

  useEffect(fetchEvents, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      name: event.name,
      description: event.description,
      date: event.date?.slice(0, 10),
      time: event.time,
      venue: event.venue,
      organizer: event.organizer,
      category: event.category,
      registrationLimit: event.registrationLimit,
      status: event.status,
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await api.put(`/events/admin/${editing._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Event updated");
      } else {
        await api.post("/events/admin", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Event created");
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/admin/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/events/admin/${id}/status`, { status });
      fetchEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <button onClick={openCreate} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : events.length === 0 ? (
        <EmptyState message="No events yet. Create your first one." />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block admin-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 px-4">Event</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Venue</th>
                  <th className="pb-3 px-4">Registered</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium truncate max-w-xs">{e.name}</td>
                    <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{format(new Date(e.date), "dd MMM yyyy")}</td>
                    <td className="py-4 px-4 text-gray-500 truncate max-w-xs">{e.venue}</td>
                    <td className="py-4 px-4 text-gray-500 text-center">{e.registeredUsers.length}{e.registrationLimit ? `/${e.registrationLimit}` : ""}</td>
                    <td className="py-4 px-4">
                      <select
                        value={e.status}
                        onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="registration_closed">Registration Closed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right space-x-3">
                      <button onClick={() => openEdit(e)} className="text-gray-500 hover:text-primary-600 transition-colors" title="Edit"><Pencil className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(e._id)} className="text-gray-500 hover:text-red-600 transition-colors" title="Delete"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {events.map((e) => (
              <div key={e._id} className="admin-card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 pr-2 flex-1">{e.name}</h3>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(e)} className="text-gray-500 hover:text-primary-600" title="Edit"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(e._id)} className="text-gray-500 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">{format(new Date(e.date), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Venue:</span>
                    <span className="font-medium text-gray-900 text-right max-w-xs">{e.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registered:</span>
                    <span className="font-medium text-gray-900">{e.registeredUsers.length}{e.registrationLimit ? `/${e.registrationLimit}` : ""}</span>
                  </div>
                </div>
                <select
                  value={e.status}
                  onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="registration_closed">Registration Closed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Event" : "Add Event"} wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Event Name</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea required rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input required type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="label">Time</label>
              <input className="input" placeholder="e.g. 10:00 AM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Venue</label>
              <input required className="input" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Registration Limit (0 = unlimited)</label>
              <input type="number" min="0" className="input" value={form.registrationLimit} onChange={(e) => setForm({ ...form, registrationLimit: e.target.value })} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="registration_closed">Registration Closed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Banner Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" />
          </div>
          <button disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : editing ? "Update Event" : "Create Event"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
