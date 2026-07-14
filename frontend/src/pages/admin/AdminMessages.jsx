import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trash2, Reply } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import { Spinner, EmptyState } from "../../components/Ui.jsx";
import Modal from "../../components/admin/Modal.jsx";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = () => {
    setLoading(true);
    api.get("/contact/admin/all").then(({ data }) => setMessages(data.messages)).finally(() => setLoading(false));
  };

  useEffect(fetchMessages, []);

  const openMessage = async (id) => {
    const { data } = await api.get(`/contact/admin/${id}`);
    setSelected(data.message);
    setReply(data.message.adminReply || "");
    fetchMessages();
  };

  const handleReply = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post(`/contact/admin/${selected._id}/reply`, { reply });
      toast.success("Reply sent");
      setSelected(null);
      fetchMessages();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/admin/${id}`);
      toast.success("Message deleted");
      fetchMessages();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>

      {loading ? (
        <Spinner />
      ) : messages.length === 0 ? (
        <EmptyState message="No messages yet." />
      ) : (
        <>
          <div className="hidden md:block admin-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 px-4">From</th>
                  <th className="pb-3 px-4">Subject</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m._id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${!m.isRead ? "font-semibold" : ""}`}>
                    <td className="py-4 px-4">
                      <button onClick={() => openMessage(m._id)} className="hover:text-primary-600 text-left">
                        {m.name}<div className="text-xs text-gray-400 font-normal">{m.email}</div>
                      </button>
                    </td>
                    <td className="py-4 px-4 text-gray-600 font-normal truncate max-w-xs">{m.subject || "(No subject)"}</td>
                    <td className="py-4 px-4 text-gray-500 font-normal whitespace-nowrap">{format(new Date(m.createdAt), "dd MMM yyyy")}</td>
                    <td className="py-4 px-4 font-normal">
                      <span className={`px-2 py-1 rounded-full text-xs ${m.repliedAt ? "bg-green-100 text-green-700" : m.isRead ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-700"}`}>
                        {m.repliedAt ? "Replied" : m.isRead ? "Read" : "New"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-3 font-normal">
                      <button onClick={() => openMessage(m._id)} className="text-gray-500 hover:text-primary-600 transition-colors"><Reply className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(m._id)} className="text-gray-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {messages.map((m) => (
              <div key={m._id} className="admin-card">
                <div className="flex justify-between items-start mb-3">
                  <button onClick={() => openMessage(m._id)} className={`flex-1 text-left hover:text-primary-600 ${!m.isRead ? "font-semibold" : ""}`}>
                    <p className="text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400 font-normal truncate">{m.email}</p>
                  </button>
                  <span className={`px-2 py-1 rounded-full text-xs shrink-0 ml-2 ${m.repliedAt ? "bg-green-100 text-green-700" : m.isRead ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-700"}`}>
                    {m.repliedAt ? "Replied" : m.isRead ? "Read" : "New"}
                  </span>
                </div>
                <div className="space-y-2 text-sm mb-3">
                  <div><span className="text-gray-600">Subject:</span><p className="font-medium text-gray-900 truncate">{m.subject || "(No subject)"}</p></div>
                  <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="text-gray-900">{format(new Date(m.createdAt), "dd MMM yyyy")}</span></div>
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => openMessage(m._id)} className="flex-1 text-primary-600 font-medium hover:bg-primary-50 py-2 rounded">Reply</button>
                  <button onClick={() => handleDelete(m._id)} className="flex-1 text-red-600 font-medium hover:bg-red-50 py-2 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message Details" wide>
        {selected && (
          <div>
            <div className="mb-4 space-y-1 text-sm">
              <p><span className="text-gray-500">From:</span> {selected.name} ({selected.email})</p>
              {selected.phone && <p><span className="text-gray-500">Phone:</span> {selected.phone}</p>}
              <p><span className="text-gray-500">Subject:</span> {selected.subject || "-"}</p>
              <p className="pt-2 whitespace-pre-line">{selected.message}</p>
            </div>
            <form onSubmit={handleReply} className="space-y-3 border-t border-gray-100 pt-4">
              <label className="label">Reply</label>
              <textarea required rows={4} className="input" value={reply} onChange={(e) => setReply(e.target.value)} />
              <button disabled={sending} className="btn-primary w-full">{sending ? "Sending..." : "Send Reply"}</button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
