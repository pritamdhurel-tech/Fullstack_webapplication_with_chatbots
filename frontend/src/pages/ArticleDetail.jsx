import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SkeletonCard from "../components/skeleton/SkeletonCard";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ArticleDetail() {
  const { id } = useParams();
  const { data: articles, loading, error } = useFetch("/api/articles");

  const article = articles.find((entry) => String(entry.id) === String(id));

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <SkeletonCard type="article" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <p className="text-[#FF6B6B] text-sm">
          Could not load this article. Please try again later.
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <p className="text-[#8A8FA8] text-base">
          We could not find that article.
        </p>
        <Link
          to="/articles"
          className="text-accent font-semibold mt-4 inline-block"
        >
          ← Back to articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <Link
        to="/articles"
        className="text-sm font-semibold text-accent hover:underline"
      >
        ← Back to articles
      </Link>

      <div className="glass-card p-8 md:p-10 mt-6">
        <p className="text-[11px] uppercase tracking-wider text-[#4A4F66] mb-4">
          {formatDate(article.published_date)}{" "}
          {article.category ? `• ${article.category}` : ""}
          {article.author ? ` • By ${article.author}` : ""}
        </p>
        <h1 className="section-title text-3xl md:text-4xl mb-6">
          {article.title}
        </h1>
        <div className="text-[#8A8FA8] text-lg leading-relaxed whitespace-pre-wrap">
          {article.content || article.excerpt}
        </div>

        <div className="mt-8">
          <Link
            to={`/contact?type=article&name=${encodeURIComponent(article.title)}`}
            className="btn-primary"
          >
            Ask about this topic
          </Link>
        </div>
      </div>
    </div>
  );
}
