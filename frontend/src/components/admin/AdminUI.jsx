// src/components/admin/AdminUI.jsx
// Shared UI primitives used across all admin management screens

// ── Modal ──────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0D1120] border border-white/10 rounded-[14px]
                      w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4
                        border-b border-white/10">
          <h3 className="font-display text-base font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#4A4F66] hover:text-white text-xl bg-transparent
                       border-0 cursor-pointer leading-none"
          >×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ── FormField ──────────────────────────────────────────────────────
export function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-xs font-semibold tracking-wide
                        text-[#8A8FA8] uppercase">{label}</label>
      {children}
      {error && <p className="text-xs text-[#FF6B6B]">{error}</p>}
    </div>
  )
}

export function Input({ error, ...props }) {
  return (
    <input
      className={`form-input ${error ? 'border-[#FF6B6B]' : ''}`}
      {...props}
    />
  )
}

export function Textarea({ error, ...props }) {
  return (
    <textarea
      rows={3}
      className={`form-input resize-none ${error ? 'border-[#FF6B6B]' : ''}`}
      {...props}
    />
  )
}

export function Select({ error, children, ...props }) {
  return (
    <select
      className={`form-input ${error ? 'border-[#FF6B6B]' : ''}`}
      {...props}
    >
      {children}
    </select>
  )
}

// ── Table ──────────────────────────────────────────────────────────
export function Table({ headers, children, empty = 'No records found.' }) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold
                                     tracking-wider uppercase text-[#8A8FA8]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children ?? (
            <tr>
              <td colSpan={headers.length}
                  className="px-4 py-8 text-center text-[#4A4F66] text-sm">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Tr({ children }) {
  return (
    <tr className="border-b border-white/[0.06] hover:bg-white/[0.03]
                   transition-colors">
      {children}
    </tr>
  )
}

export function Td({ children, className = '' }) {
  return (
    <td className={`px-4 py-3 text-[#8A8FA8] ${className}`}>
      {children}
    </td>
  )
}

// ── Action buttons ─────────────────────────────────────────────────
export function EditBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className="text-xs font-medium text-accent hover:underline
                 bg-transparent border-0 cursor-pointer mr-3">
      Edit
    </button>
  )
}

export function DeleteBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className="text-xs font-medium text-[#FF6B6B] hover:underline
                 bg-transparent border-0 cursor-pointer">
      Delete
    </button>
  )
}

// ── Page header ────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">{title}</h1>
        {subtitle && <p className="text-sm text-[#8A8FA8]">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ── Alert ──────────────────────────────────────────────────────────
export function Alert({ type = 'error', message }) {
  if (!message) return null
  const styles = {
    error:   'bg-[#FF6B6B]/10 border-[#FF6B6B]/30 text-[#FF6B6B]',
    success: 'bg-[#00D4AA]/10 border-[#00D4AA]/30 text-[#00D4AA]',
  }
  return (
    <div className={`px-4 py-3 rounded-lg border text-sm mb-5 ${styles[type]}`}>
      {message}
    </div>
  )
}

// ── Stars display ──────────────────────────────────────────────────
export function Stars({ rating }) {
  return (
    <span>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-[#4A4F66]'}>★</span>
      ))}
    </span>
  )
}
