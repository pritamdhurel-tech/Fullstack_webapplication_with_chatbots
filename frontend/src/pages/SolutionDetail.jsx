import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SkeletonCard from "../components/skeleton/SkeletonCard";

export default function SolutionDetail() {
  const { id } = useParams();
  const { data: solutions, loading, error } = useFetch("/api/solutions");

  const solution = solutions.find((item) => String(item.id) === String(id));

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <SkeletonCard type="solution" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <p className="text-[#FF6B6B] text-sm">
          Could not load this solution. Please try again later.
        </p>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <p className="text-[#8A8FA8] text-base">
          We could not find that solution.
        </p>
        <Link
          to="/solutions"
          className="text-accent font-semibold mt-4 inline-block"
        >
          ← Back to solutions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <Link
        to="/solutions"
        className="text-sm font-semibold text-accent hover:underline"
      >
        ← Back to solutions
      </Link>

      <div className="glass-card p-8 md:p-10 mt-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="text-4xl">{solution.icon ?? "⚡"}</div>
          <div>
            <p className="section-label">Solution detail</p>
            <h1 className="section-title text-3xl md:text-4xl">
              {solution.title}
            </h1>
          </div>
        </div>

        <p className="text-[#8A8FA8] text-lg leading-relaxed mb-6">
          {solution.description}
        </p>

        {solution.tag && (
          <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
            {solution.tag}
          </span>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/contact?type=solution&name=${encodeURIComponent(solution.title)}`}
            className="btn-primary"
          >
            Register interest
          </Link>
          <Link
            to="/past-work"
            className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 hover:border-accent/40 hover:text-white"
          >
            Explore case studies
          </Link>
        </div>
      </div>
    </div>
  );
}
