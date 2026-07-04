// src/components/admin/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/solutions", label: "Solutions", icon: "⚡" },
  { to: "/admin/past-work", label: "Past Work", icon: "🏭" },
  { to: "/admin/feedback", label: "Feedback", icon: "⭐" },
  { to: "/admin/gallery", label: "Gallery", icon: "🖼️" },
  { to: "/admin/events", label: "Events", icon: "📅" },
  { to: "/admin/articles", label: "Articles", icon: "📝" },
  { to: "/admin/enquiries", label: "Enquiries", icon: "📬" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("admin_token");
    showToast("You have been logged out", "info");
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#080B12] text-[#F0F0F5]">
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col
                        bg-[#0D1120] border-r border-white/10
                        fixed top-0 left-0 h-full z-40"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <span className="font-display text-base font-bold">
            AI<span className="text-accent">.</span>Solutions
          </span>
          <p className="text-[10px] text-[#4A4F66] mt-0.5 tracking-wider uppercase">
            Admin Panel
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors
                 no-underline ${
                   isActive
                     ? "bg-accent/10 text-accent border-r-2 border-accent"
                     : "text-[#8A8FA8] hover:text-[#F0F0F5] hover:bg-white/[0.04]"
                 }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-5 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-sm text-[#FF6B6B] hover:text-white
                       text-left bg-transparent border-0 cursor-pointer
                       flex items-center gap-2 py-1.5"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────── */}
      <main className="flex-1 ml-56 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
