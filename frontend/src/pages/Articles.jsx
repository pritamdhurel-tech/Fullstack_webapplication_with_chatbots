import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SkeletonCard from "../components/skeleton/SkeletonCard";

// Expected API shape: GET /api/articles
// [{ id, title, excerpt, published_date (ISO), author, category }]

const BAR_COLOURS = ["#6C63FF", "#00D4AA", "#FF6B6B"];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Articles() {
  const { data: articles, loading, error } = useFetch("/api/articles");

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <p className="section-label">Insights &amp; articles</p>
      <h1 className="section-title">
        Thinking from
        <br />
        the team
      </h1>
      <p className="text-[#8A8FA8] text-base leading-relaxed max-w-xl mb-14">
        Short reads on AI trends, case learnings, and what's next for digital
        employee experience.
      </p>

      {error && (
        <p className="text-[#FF6B6B] text-sm mb-8">
          Could not load articles. Please try again later.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} type="article" />
            ))
          : articles.map((a, i) => (
              <Link
                key={a.id}
                to={`/articles/${a.id}`}
                className="glass-card overflow-hidden block hover:shadow-xl transition-shadow"
              >
                <div
                  className="h-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${BAR_COLOURS[i % BAR_COLOURS.length]}, transparent)`,
                  }}
                />
                <div className="p-6">
                  <p className="text-[11px] text-[#4A4F66] uppercase tracking-wider mb-3">
                    {a.published_date ? formatDate(a.published_date) : "—"}
                    {a.category ? ` · ${a.category}` : ""}
                  </p>
                  <h3 className="font-display text-base font-semibold leading-snug mb-2">
                    {a.title}
                  </h3>
                  <p className="text-sm text-[#8A8FA8] leading-relaxed mb-5">
                    {a.excerpt}
                  </p>
                  <span className="text-xs text-accent font-semibold flex items-center gap-1 hover:underline">
                    Read article →
                  </span>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
