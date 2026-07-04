// src/pages/admin/AdminGallery.jsx
// FR10 — gallery image upload (multipart), delete, optional event_id FK
import { useState, useEffect } from "react";
import { buildApiUrl } from "../../hooks/useFetch";
import { PageHeader, Alert, DeleteBtn } from "../../components/admin/AdminUI";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [caption, setCaption] = useState("");
  const [eventId, setEventId] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("admin_token");

  async function load() {
    const [imgRes, evRes] = await Promise.all([
      fetch(buildApiUrl("/api/gallery")),
      fetch(buildApiUrl("/api/events")),
    ]);
    const imgData = await imgRes.json();
    const evData = await evRes.json();
    setImages(imgData.data ?? []);
    setEvents(evData.data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload() {
    if (!file) {
      setError("Please select an image file.");
      return;
    }
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);
    if (caption) formData.append("caption", caption);
    if (eventId) formData.append("event_id", eventId);

    try {
      const res = await fetch(buildApiUrl("/api/gallery"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error();
      setCaption("");
      setEventId("");
      setFile(null);
      document.getElementById("gallery-file-input").value = "";
      setSuccess("Image uploaded successfully.");
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    await fetch(buildApiUrl(`/api/gallery/${id}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setSuccess("Image deleted.");
    load();
    setTimeout(() => setSuccess(""), 3000);
  }

  return (
    <div>
      <PageHeader
        title="Gallery"
        subtitle="Upload and manage promotional event photos"
      />

      {/* Upload panel */}
      <div className="glass-card p-6 mb-8">
        <h2 className="font-display text-base font-semibold mb-5">
          Upload new image
        </h2>
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#8A8FA8]">
              Image file *
            </label>
            <input
              id="gallery-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files[0])}
              className="form-input text-sm file:mr-3 file:py-1 file:px-3
                         file:rounded file:border-0 file:bg-accent/20
                         file:text-accent file:text-xs file:cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#8A8FA8]">
              Caption
            </label>
            <input
              className="form-input"
              placeholder="Optional caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#8A8FA8]">
              Link to event (optional)
            </label>
            <select
              className="form-input"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            >
              <option value="">No event</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload image"}
        </button>
      </div>

      {/* Image grid */}
      <h2 className="font-display text-base font-semibold mb-4">
        All images ({images.length})
      </h2>
      {images.length === 0 ? (
        <p className="text-sm text-[#4A4F66]">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="glass-card overflow-hidden group relative"
            >
              <img
                src={img.image_url}
                alt={img.caption ?? "Gallery image"}
                className="w-full aspect-square object-cover"
              />
              <div className="p-3">
                <p className="text-xs text-[#8A8FA8] truncate">
                  {img.caption ?? "No caption"}
                </p>
                {img.event_name && (
                  <p className="text-[10px] text-accent truncate mt-0.5">
                    📅 {img.event_name}
                  </p>
                )}
                <div className="mt-2">
                  <DeleteBtn onClick={() => handleDelete(img.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
