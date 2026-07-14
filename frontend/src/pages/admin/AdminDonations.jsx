import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Download } from "lucide-react";
import api from "../../services/api.js";
import { Spinner, EmptyState } from "../../components/Ui.jsx";

const statusColors = {
  success: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = status ? `?status=${status}` : "";
    api.get(`/donations/admin/all${params}`).then(({ data }) => setDonations(data.donations)).finally(() => setLoading(false));
  }, [status]);

  const exportFile = async (type) => {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`/api/donations/admin/export/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations.${type === "excel" ? "xlsx" : type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalSuccess = donations.filter((d) => d.paymentStatus === "success").reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Manage Donations</h1>
        <div className="flex gap-2">
          <button onClick={() => exportFile("csv")} className="btn-outline text-sm flex items-center gap-1.5"><Download className="w-4 h-4" /> CSV</button>
          <button onClick={() => exportFile("excel")} className="btn-outline text-sm flex items-center gap-1.5"><Download className="w-4 h-4" /> Excel</button>
          <button onClick={() => exportFile("pdf")} className="btn-outline text-sm flex items-center gap-1.5"><Download className="w-4 h-4" /> PDF</button>
        </div>
      </div>

      <div className="admin-card mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Raised (successful)</p>
          <p className="text-2xl font-bold text-primary-600">₹{totalSuccess.toLocaleString("en-IN")}</p>
        </div>
        <select className="input w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : donations.length === 0 ? (
        <EmptyState message="No donations found." />
      ) : (
        <>
          <div className="hidden md:block admin-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 px-4">Donor</th>
                  <th className="pb-3 px-4">Amount</th>
                  <th className="pb-3 px-4">Cause</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Receipt</th>
                  <th className="pb-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium truncate max-w-xs">{d.name}</div>
                      <div className="text-xs text-gray-400 truncate">{d.email}</div>
                    </td>
                    <td className="py-4 px-4 font-medium whitespace-nowrap">₹{d.amount}</td>
                    <td className="py-4 px-4 text-gray-500 truncate max-w-xs">{d.cause?.title || "General Fund"}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[d.paymentStatus]}`}>{d.paymentStatus}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-xs">{d.receiptNumber || "-"}</td>
                    <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{format(new Date(d.createdAt), "dd MMM yyyy")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {donations.map((d) => (
              <div key={d._id} className="admin-card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{d.name}</h3>
                    <p className="text-xs text-gray-400 truncate">{d.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${statusColors[d.paymentStatus]}`}>{d.paymentStatus}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Amount:</span><span className="font-semibold">₹{d.amount}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Cause:</span><span className="font-medium text-right max-w-xs">{d.cause?.title || "General Fund"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Receipt:</span><span className="text-xs">{d.receiptNumber || "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-medium">{format(new Date(d.createdAt), "dd MMM yyyy")}</span></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
