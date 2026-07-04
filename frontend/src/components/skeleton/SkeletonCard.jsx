/**
 * SkeletonCard — renders a shimmer placeholder that matches each page's card layout.
 *
 * Props:
 *   type: 'solution' | 'case' | 'feedback' | 'gallery' | 'event' | 'article'
 */
export default function SkeletonCard({ type = 'solution' }) {
  const base = 'skeleton'

  if (type === 'solution') {
    return (
      <div className="glass-card p-7">
        <div className={`${base} w-11 h-11 rounded-[10px] mb-5`} />
        <div className={`${base} h-5 w-2/3 mb-3`} />
        <div className={`${base} h-3.5 w-full mb-2`} />
        <div className={`${base} h-3.5 w-4/5 mb-2`} />
        <div className={`${base} h-3.5 w-3/5 mb-5`} />
        <div className={`${base} h-6 w-24 rounded-full`} />
      </div>
    )
  }

  if (type === 'case') {
    return (
      <div className="glass-card overflow-hidden">
        <div className={`${base} h-48 rounded-none rounded-t-[14px]`} />
        <div className="p-6">
          <div className={`${base} h-5 w-3/5 mb-3`} />
          <div className={`${base} h-3.5 w-full mb-2`} />
          <div className={`${base} h-3.5 w-4/5 mb-5`} />
          <div className="flex gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center">
                <div className={`${base} h-6 w-10 mb-1`} />
                <div className={`${base} h-3 w-12`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'feedback') {
    return (
      <div className="glass-card p-6">
        <div className={`${base} h-4 w-20 mb-4 rounded-full`} />
        <div className={`${base} h-3.5 w-full mb-2`} />
        <div className={`${base} h-3.5 w-full mb-2`} />
        <div className={`${base} h-3.5 w-3/4 mb-5`} />
        <div className="flex items-center gap-3">
          <div className={`${base} w-9 h-9 rounded-full flex-shrink-0`} />
          <div className="flex-1">
            <div className={`${base} h-3.5 w-2/5 mb-1.5`} />
            <div className={`${base} h-3 w-3/5`} />
          </div>
        </div>
      </div>
    )
  }

  if (type === 'gallery') {
    return (
      <div className={`${base} rounded-lg`} style={{ aspectRatio: '1' }} />
    )
  }

  if (type === 'event') {
    return (
      <div className="glass-card flex items-center gap-5 px-6 py-5">
        <div className="text-center min-w-[52px]">
          <div className={`${base} h-8 w-9 mx-auto mb-1.5 rounded`} />
          <div className={`${base} h-2.5 w-7 mx-auto`} />
        </div>
        <div className="w-px h-11 bg-white/10 flex-shrink-0" />
        <div className="flex-1">
          <div className={`${base} h-4 w-3/5 mb-2`} />
          <div className={`${base} h-3.5 w-4/5`} />
        </div>
        <div className={`${base} h-6 w-20 rounded-full`} />
      </div>
    )
  }

  if (type === 'article') {
    return (
      <div className="glass-card overflow-hidden">
        <div className={`${base} h-1.5 rounded-none`} />
        <div className="p-6">
          <div className={`${base} h-3 w-2/5 mb-3`} />
          <div className={`${base} h-5 w-4/5 mb-2`} />
          <div className={`${base} h-5 w-3/5 mb-4`} />
          <div className={`${base} h-3.5 w-full mb-2`} />
          <div className={`${base} h-3.5 w-5/6 mb-5`} />
          <div className={`${base} h-3.5 w-24`} />
        </div>
      </div>
    )
  }

  return null
}
