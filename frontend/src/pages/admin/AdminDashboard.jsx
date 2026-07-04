// src/pages/admin/AdminDashboard.jsx
// FR11 — shows total enquiry count and recent submissions
import { useEffect, useState } from "react";
import { buildApiUrl } from "../../hooks/useFetch";
import { PageHeader, Alert } from "../../components/admin/AdminUI";

function StatCard({ label, value, icon, color }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full
                          border ${color}`}
        >
          Live
        </span>
      </div>
      <div className="font-display text-3xl font-bold mb-1">{value ?? "—"}</div>
      <div className="text-sm text-[#8A8FA8]">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(buildApiUrl("/api/enquiries"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setStats(data.total);
        setRecent(data.data.slice(0, 5));
      } catch (err) {
        setError("Could not load dashboard data.");
      }
    }
    load();
  }, [token]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of AI-Solutions website activity"
      />

      <Alert type="error" message={error} />

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <StatCard
          label="Total enquiries received"
          value={stats}
          icon="📬"
          color="bg-accent/10 text-accent border-accent/25"
        />
        <StatCard
          label="Admin panel status"
          value="Active"
          icon="✅"
          color="bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/25"
        />
        <StatCard
          label="Content sections managed"
          value="6"
          icon="📁"
          color="bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/25"
        />
      </div>

      {/* Recent enquiries */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">
          Recent enquiries
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-[#4A4F66]">No enquiries yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((e) => (
              <div
                key={e.id}
                className="glass-card px-5 py-4 flex items-center
                           justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{e.full_name}</p>
                  <p className="text-xs text-[#8A8FA8] truncate">
                    {e.company_name} · {e.job_title}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[#4A4F66]">
                    {new Date(e.submitted_at).toLocaleDateString("en-GB")}
                  </p>
                  <p className="text-xs text-[#8A8FA8] truncate max-w-[120px]">
                    {e.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
