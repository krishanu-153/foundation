import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../../services/api.js";
import { Spinner, EmptyState } from "../../components/Ui.jsx";
import Modal from "../../components/admin/Modal.jsx";

const categories = ["NGO Activities", "Event Updates", "Success Stories", "Awareness Articles"];
const emptyForm = { title: "", content: "", excerpt: "", category: categories[0], tags: "", status: "draft" };

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBlogs = () => {
    setLoading(true);
    api.get("/blogs/admin/all").then(({ data }) => setBlogs(data.blogs)).finally(() => setLoading(false));
  };

  useEffect(fetchBlogs, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setCoverFile(null);
    setModalOpen(true);
  };

  const openEdit = (blog) => {
    setEditing(blog);
    setForm({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      category: blog.category,
      tags: blog.tags.join(", "),
      status: blog.status,
    });
    setCoverFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (coverFile) fd.append("coverImage", coverFile);

      if (editing) {
        await api.put(`/blogs/admin/${editing._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Blog updated");
      } else {
        await api.post("/blogs/admin", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Blog created");
      }
      setModalOpen(false);
      fetchBlogs();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await api.delete(`/blogs/admin/${id}`);
      toast.success("Blog deleted");
      fetchBlogs();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <button onClick={openCreate} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Blog
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : blogs.length === 0 ? (
        <EmptyState message="No blog posts yet." />
      ) : (
        <>
          <div className="hidden md:block admin-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 px-4">Title</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Views</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b) => (
                  <tr key={b._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium truncate max-w-xs">{b.title}</td>
                    <td className="py-4 px-4 text-gray-500">{b.category}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-500">{b.views}</td>
                    <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{format(new Date(b.createdAt), "dd MMM yyyy")}</td>
                    <td className="py-4 px-4 text-right space-x-3">
                      <button onClick={() => openEdit(b)} className="text-gray-500 hover:text-primary-600 transition-colors"><Pencil className="w-4 h-4 inline" /></button>
                      <button onClick={() => handleDelete(b._id)} className="text-gray-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {blogs.map((b) => (
              <div key={b._id} className="admin-card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2">{b.title}</h3>
                  <div className="flex gap-2 shrink-0 ml-2">
                    <button onClick={() => openEdit(b)} className="text-gray-500 hover:text-primary-600"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(b._id)} className="text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Category:</span><span className="font-medium">{b.category}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Status:</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{b.status}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Views:</span><span className="font-medium">{b.views}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-medium">{format(new Date(b.createdAt), "dd MMM yyyy")}</span></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Blog" : "Add Blog"} wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Excerpt</label>
            <input className="input" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </div>
          <div>
            <label className="label">Content</label>
            <ReactQuill theme="snow" value={form.content} onChange={(val) => setForm({ ...form, content: val })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Tags (comma-separated)</label>
            <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div>
            <label className="label">Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="text-sm" />
          </div>
          <button disabled={saving} className="btn-primary w-full">{saving ? "Saving..." : editing ? "Update Blog" : "Create Blog"}</button>
        </form>
      </Modal>
    </div>
  );
}
