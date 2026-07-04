import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SkeletonCard from "../components/skeleton/SkeletonCard";

// Expected API shape: GET /api/solutions
// [{ id, title, description, icon, tag, tag_color }]

const ACCENT_MAP = ["accent", "teal", "red"];

export default function Solutions() {
  const { data: solutions, loading, error } = useFetch("/api/solutions");

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <p className="section-label">What we offer</p>
      <h1 className="section-title">
        Software solutions
        <br />
        built for scale
      </h1>
      <p className="text-[#8A8FA8] text-base leading-relaxed max-w-xl mb-14">
        Each solution is tailored to the specific demands of your industry —
        designed to reduce friction and accelerate delivery.
      </p>

      {error && (
        <p className="text-[#FF6B6B] text-sm mb-8">
          Could not load solutions. Please try again later.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} type="solution" />
            ))
          : solutions.map((s, i) => (
              <Link
                key={s.id}
                to={`/solutions/${s.id}`}
                className="glass-card p-7 relative overflow-hidden block hover:border-accent/20 transition-colors"
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]"
                  style={{
                    background: `linear-gradient(90deg, var(--tw-gradient-from), transparent)`,
                  }}
                />
                <div className="text-3xl mb-5">{s.icon ?? "⚡"}</div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-[#8A8FA8] leading-relaxed mb-5">
                  {s.description}
                </p>
                {s.tag && (
                  <span
                    className="text-[11px] font-semibold px-3 py-1 rounded-full
                                 bg-accent/10 text-accent border border-accent/25"
                  >
                    {s.tag}
                  </span>
                )}
              </Link>
            ))}
      </div>
    </div>
  );
}
