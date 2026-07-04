import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SkeletonCard from "../components/skeleton/SkeletonCard";

export default function PastWorkDetail() {
  const { id } = useParams();
  const { data: cases, loading, error } = useFetch("/api/past-work");

  const item = cases.find((entry) => String(entry.id) === String(id));

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <SkeletonCard type="case" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <p className="text-[#FF6B6B] text-sm">
          Could not load this case study. Please try again later.
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <p className="text-[#8A8FA8] text-base">
          We could not find that case study.
        </p>
        <Link
          to="/past-work"
          className="text-accent font-semibold mt-4 inline-block"
        >
          ← Back to past work
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <Link
        to="/past-work"
        className="text-sm font-semibold text-accent hover:underline"
      >
        ← Back to past work
      </Link>

      <div className="glass-card p-8 md:p-10 mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4A4F66] mb-3">
          {item.industry} {item.year ? `• ${item.year}` : ""}
        </p>
        <h1 className="section-title text-3xl md:text-4xl mb-4">
          {item.title}
        </h1>
        <p className="text-[#8A8FA8] text-lg leading-relaxed mb-6">
          {item.description}
        </p>

        {item.metrics?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {item.metrics.map((metric, index) => (
              <div
                key={`${metric.label}-${index}`}
                className="rounded-xl border border-white/10 bg-[#0F1426] p-4"
              >
                <div className="text-2xl font-semibold text-[#00D4AA]">
                  {metric.value}
                </div>
                <div className="text-xs uppercase tracking-wide text-[#4A4F66] mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to={`/contact?type=project&name=${encodeURIComponent(item.title)}`}
            className="btn-primary"
          >
            Register interest
          </Link>
          <Link
            to="/events"
            className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 hover:border-accent/40 hover:text-white"
          >
            See related events
          </Link>
        </div>
      </div>
    </div>
  );
}
