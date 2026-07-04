import { Link, useLocation } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import SkeletonCard from "../components/skeleton/SkeletonCard";

// Expected API shape: GET /api/gallery
// [{ id, image_url, caption, event_id, event_name }]
// NOTE: event_id is a FK to the events table — added per Tutorial 3 client feedback.
// image_url should be a relative path e.g. /uploads/gallery/photo.jpg

export default function Gallery() {
  const location = useLocation();
  const { data: images, loading, error } = useFetch("/api/gallery");

  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get("eventId");
  const filteredImages = eventId
    ? images.filter(
        (img) =>
          String(img.event_id ?? img.event?.id ?? "") === String(eventId),
      )
    : images;
  const selectedEventName =
    filteredImages.find((img) => img.event_name)?.event_name ?? null;

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <p className="section-label">Photo gallery</p>
      <h1 className="section-title">Events &amp; moments</h1>
      <p className="text-[#8A8FA8] text-base leading-relaxed max-w-xl mb-14">
        A visual record of our promotional events, workshops, and industry
        conferences.
      </p>

      {error && (
        <p className="text-[#FF6B6B] text-sm mb-8">
          Could not load gallery. Please try again later.
        </p>
      )}

      {eventId && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0F1426] px-4 py-3">
          <p className="text-sm text-[#8A8FA8]">
            Showing images for{" "}
            <span className="font-semibold text-white">
              {selectedEventName ?? "this event"}
            </span>
            .
          </p>
          <Link
            to="/gallery"
            className="text-sm font-semibold text-accent hover:underline"
          >
            Show all images
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} type="gallery" />
            ))
          : filteredImages.map((img) => (
              <Link
                key={img.id}
                to={
                  img.event_id ? `/gallery?eventId=${img.event_id}` : "/gallery"
                }
                className="relative rounded-lg overflow-hidden cursor-pointer group block"
              >
                {img.image_url ? (
                  <img
                    src={img.image_url}
                    alt={img.caption ?? "Gallery image"}
                    className="w-full aspect-square object-cover transition-transform
                             duration-300 group-hover:scale-105"
                  />
                ) : (
                  /* Placeholder when no image is uploaded yet */
                  <div
                    className="w-full aspect-square bg-[#111827] border border-white/10
                                flex items-center justify-center text-4xl text-white/10"
                  >
                    📷
                  </div>
                )}

                {/* Overlay with caption + event tag */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#080B12]/90 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300
                              flex flex-col justify-end p-4"
                >
                  {img.caption && (
                    <p className="text-sm font-medium text-white">
                      {img.caption}
                    </p>
                  )}
                  {img.event_name && (
                    <p className="text-[11px] text-[#8A8FA8] mt-1">
                      📅 {img.event_name}
                    </p>
                  )}
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
