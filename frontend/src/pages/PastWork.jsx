import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SkeletonCard from "../components/skeleton/SkeletonCard";

// Expected API shape: GET /api/past-work
// [{ id, title, industry, description, icon, year, metrics: [{value, label}] }]

export default function PastWork() {
  const { data: cases, loading, error } = useFetch("/api/past-work");

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <p className="section-label">Case studies</p>
      <h1 className="section-title">
        Results we've
        <br />
        delivered
      </h1>
      <p className="text-[#8A8FA8] text-base leading-relaxed max-w-xl mb-14">
        Real outcomes from real projects. Each engagement is treated as a case
        study in what becomes possible when AI is applied with care.
      </p>

      {error && (
        <p className="text-[#FF6B6B] text-sm mb-8">
          Could not load case studies. Please try again later.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} type="case" />
            ))
          : cases.map((c) => (
              <Link
                key={c.id}
                to={`/past-work/${c.id}`}
                className="glass-card overflow-hidden block hover:border-accent/20 transition-colors"
              >
                {/* Image / header area */}
                <div
                  className="h-48 relative flex items-end p-5"
                  style={{
                    background: "linear-gradient(135deg, #1a1f35, #0d1120)",
                  }}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center
                                 text-6xl opacity-15"
                  >
                    {c.icon ?? "🏭"}
                  </span>
                  <span
                    className="relative z-10 text-[11px] font-semibold tracking-widest
                                 uppercase bg-black/60 backdrop-blur-md border border-white/10
                                 rounded-full px-3 py-1 text-[#8A8FA8]"
                  >
                    {c.industry}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-base font-semibold mb-2 leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-sm text-[#8A8FA8] leading-relaxed mb-5">
                    {c.description}
                  </p>

                  {/* Metrics */}
                  {c.metrics?.length > 0 && (
                    <div className="flex gap-5">
                      {c.metrics.map((m, i) => (
                        <div key={i} className="text-center">
                          <div className="font-display text-xl font-bold text-[#00D4AA]">
                            {m.value}
                          </div>
                          <div className="text-[11px] text-[#4A4F66] mt-0.5">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
