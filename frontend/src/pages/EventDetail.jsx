import { Link, useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SkeletonCard from "../components/skeleton/SkeletonCard";

const TYPE_STYLES = {
  "In-person": "bg-accent/10 text-accent border-accent/25",
  Online: "bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/25",
  Hybrid: "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/25",
};

function formatDate(iso) {
  if (!iso) return "TBC";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: events, loading, error } = useFetch("/api/events");

  const eventItem = events.find((item) => String(item.id) === String(id));

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <SkeletonCard type="event" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <p className="text-[#FF6B6B] text-sm">
          Could not load this event. Please try again later.
        </p>
      </div>
    );
  }

  if (!eventItem) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-20">
        <p className="text-[#8A8FA8] text-base">
          We could not find that event.
        </p>
        <Link
          to="/events"
          className="text-accent font-semibold mt-4 inline-block"
        >
          ← Back to events
        </Link>
      </div>
    );
  }

  const badgeClass = TYPE_STYLES[eventItem.event_type] ?? TYPE_STYLES["Hybrid"];
  const galleryImages = (eventItem.gallery_images ?? []).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-semibold text-accent hover:underline"
      >
        ← Back
      </button>

      <div className="glass-card p-8 md:p-10 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="section-label">Event detail</p>
            <h1 className="section-title text-3xl md:text-4xl">
              {eventItem.name}
            </h1>
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${badgeClass}`}
          >
            {eventItem.event_type ?? "Event"}
          </span>
        </div>

        <p className="text-[#8A8FA8] text-lg leading-relaxed mb-6">
          {eventItem.description}
        </p>

        <div className="rounded-xl border border-white/10 bg-[#0F1426] p-5 mb-8">
          <p className="text-sm text-[#8A8FA8] mb-2">Date</p>
          <p className="text-lg font-semibold text-white">
            {formatDate(eventItem.date)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/contact?type=event&name=${encodeURIComponent(eventItem.name)}`}
            className="btn-primary"
          >
            Register for this event
          </Link>
          <Link
            to="/gallery"
            className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 hover:border-accent/40 hover:text-white"
          >
            View gallery
          </Link>
        </div>

        {galleryImages.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">
              Related gallery images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryImages.map((image) => (
                <Link
                  key={image.id}
                  to={`/gallery?eventId=${eventItem.id}`}
                  className="overflow-hidden rounded-lg border border-white/10"
                >
                  <img
                    src={image.image_url}
                    alt={eventItem.name}
                    className="aspect-square w-full object-cover"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
