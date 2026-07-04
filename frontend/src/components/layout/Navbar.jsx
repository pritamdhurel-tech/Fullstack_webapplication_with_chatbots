import { NavLink } from "react-router-dom";

const links = [
  { to: "/solutions", label: "Solutions" },
  { to: "/past-work", label: "Past Work" },
  { to: "/articles", label: "Articles" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/feedback", label: "Feedback" },
];

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                    px-8 py-4 bg-[#080B12]/80 backdrop-blur-xl
                    border-b border-white/10"
    >
      <NavLink
        to="/"
        className="font-display text-lg font-bold tracking-tight text-[#F0F0F5]"
      >
        AI<span className="text-accent">.</span>Solutions
      </NavLink>

      <ul className="hidden md:flex items-center gap-7 list-none">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `text-sm transition-colors duration-200 no-underline ${
                  isActive
                    ? "text-[#F0F0F5] font-medium"
                    : "text-[#8A8FA8] hover:text-[#F0F0F5]"
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <NavLink to="/contact">
        <button className="btn-primary text-sm px-5 py-2">Contact Us</button>
      </NavLink>
    </nav>
  );
}
