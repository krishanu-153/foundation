import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import { Spinner, EmptyState } from "../../components/Ui.jsx";
import Modal from "../../components/admin/Modal.jsx";

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-gray-200 text-gray-700",
};

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchVolunteers = () => {
    setLoading(true);
    const params = status ? `?status=${status}` : "";
    api.get(`/volunteers/admin/all${params}`).then(({ data }) => setVolunteers(data.volunteers)).finally(() => setLoading(false));
  };

  useEffect(fetchVolunteers, [status]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/volunteers/admin/${id}/status`, { status: newStatus });
      toast.success(`Volunteer ${newStatus}`);
      fetchVolunteers();
      setSelected(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Volunteers</h1>
        <select className="input w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : volunteers.length === 0 ? (
        <EmptyState message="No volunteer applications found." />
      ) : (
        <>
          <div className="hidden md:block admin-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 px-4">Name</th>
                  <th className="pb-3 px-4">Contact</th>
                  <th className="pb-3 px-4">Availability</th>
                  <th className="pb-3 px-4">Applied</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v) => (
                  <tr key={v._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <button onClick={() => setSelected(v)} className="font-medium hover:text-primary-600 truncate max-w-xs">{v.name}</button>
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-xs"><div className="truncate">{v.email}</div><div>{v.phone}</div></td>
                    <td className="py-4 px-4 text-gray-500 capitalize">{v.availability}</td>
                    <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{format(new Date(v.createdAt), "dd MMM yyyy")}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[v.status]}`}>{v.status}</span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2 text-xs">
                      {v.status !== "approved" && <button onClick={() => updateStatus(v._id, "approved")} className="text-green-600 font-medium hover:underline">Approve</button>}
                      {v.status !== "rejected" && <button onClick={() => updateStatus(v._id, "rejected")} className="text-red-600 font-medium hover:underline">Reject</button>}
                      {v.status === "approved" && <button onClick={() => updateStatus(v._id, "suspended")} className="text-gray-500 font-medium hover:underline">Suspend</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {volunteers.map((v) => (
              <div key={v._id} className="admin-card">
                <div className="flex justify-between items-start mb-3">
                  <button onClick={() => setSelected(v)} className="font-semibold text-gray-900 hover:text-primary-600">{v.name}</button>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${statusColors[v.status]}`}>{v.status}</span>
                </div>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between"><span className="text-gray-600">Email:</span><span className="text-xs truncate max-w-xs">{v.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Phone:</span><span>{v.phone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Availability:</span><span className="capitalize">{v.availability}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Applied:</span><span>{format(new Date(v.createdAt), "dd MMM yyyy")}</span></div>
                </div>
                <div className="flex gap-2 text-xs">
                  {v.status !== "approved" && <button onClick={() => updateStatus(v._id, "approved")} className="flex-1 text-green-600 font-medium hover:bg-green-50 py-2 rounded">Approve</button>}
                  {v.status !== "rejected" && <button onClick={() => updateStatus(v._id, "rejected")} className="flex-1 text-red-600 font-medium hover:bg-red-50 py-2 rounded">Reject</button>}
                  {v.status === "approved" && <button onClick={() => updateStatus(v._id, "suspended")} className="flex-1 text-gray-600 font-medium hover:bg-gray-100 py-2 rounded">Suspend</button>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Volunteer Profile">
        {selected && (
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Name:</span> {selected.name}</p>
            <p><span className="text-gray-500">Email:</span> {selected.email}</p>
            <p><span className="text-gray-500">Phone:</span> {selected.phone}</p>
            <p><span className="text-gray-500">Address:</span> {selected.address}</p>
            <p><span className="text-gray-500">Age:</span> {selected.age}</p>
            <p><span className="text-gray-500">Occupation:</span> {selected.occupation || "-"}</p>
            <p><span className="text-gray-500">Skills:</span> {selected.skills?.join(", ") || "-"}</p>
            <p><span className="text-gray-500">Availability:</span> {selected.availability}</p>
            <p><span className="text-gray-500">Status:</span> {selected.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
