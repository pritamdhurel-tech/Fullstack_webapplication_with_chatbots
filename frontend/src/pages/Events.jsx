import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SkeletonCard from "../components/skeleton/SkeletonCard";

// Expected API shape: GET /api/events
// [{ id, name, date (ISO string), description, event_type }]

const TYPE_STYLES = {
  "In-person": "bg-accent/10 text-accent border-accent/25",
  Online: "bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/25",
  Hybrid: "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/25",
};

function formatDate(iso) {
  const d = new Date(iso);
  return {
    day: d.getDate().toString().padStart(2, "0"),
    month: d.toLocaleString("en-GB", { month: "short" }).toUpperCase(),
  };
}

export default function Events() {
  const { data: events, loading, error } = useFetch("/api/events");

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <p className="section-label">Upcoming events</p>
      <h1 className="section-title">
        Where we'll be
        <br />
        next
      </h1>
      <p className="text-[#8A8FA8] text-base leading-relaxed max-w-xl mb-14">
        Meet the team, attend our workshops, and explore what AI can do for your
        sector.
      </p>

      {error && (
        <p className="text-[#FF6B6B] text-sm mb-8">
          Could not load events. Please try again later.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} type="event" />
            ))
          : events.map((ev) => {
              const { day, month } = formatDate(ev.date);
              const badgeClass =
                TYPE_STYLES[ev.event_type] ?? TYPE_STYLES["Hybrid"];
              return (
                <Link
                  key={ev.id}
                  to={`/events/${ev.id}`}
                  className="glass-card flex items-center gap-5 px-6 py-5 hover:border-accent/20 transition-colors"
                >
                  {/* Date block */}
                  <div className="text-center min-w-[52px]">
                    <div className="font-display text-3xl font-bold text-accent leading-none">
                      {day}
                    </div>
                    <div className="text-[11px] font-semibold tracking-wider text-[#4A4F66] mt-1">
                      {month}
                    </div>
                  </div>

                  <div className="w-px h-11 bg-white/10 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold mb-1 truncate">
                      {ev.name}
                    </h3>
                    <p className="text-sm text-[#8A8FA8] leading-snug line-clamp-2">
                      {ev.description}
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-3 py-1 rounded-full
                                  border whitespace-nowrap flex-shrink-0 ${badgeClass}`}
                  >
                    {ev.event_type ?? "Event"}
                  </span>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
