// src/pages/admin/AdminEnquiries.jsx
// FR11 — admin views all customer enquiry submissions + total count
import { useState, useEffect } from 'react'
import { PageHeader, Alert } from '../../components/admin/AdminUI'

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [total, setTotal]         = useState(0)
  const [selected, setSelected]   = useState(null)
  const [error, setError]         = useState('')
  const token = localStorage.getItem('admin_token')

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch('/api/enquiries', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setEnquiries(data.data)
        setTotal(data.total)
      } catch { setError('Could not load enquiries.') }
    }
    load()
  }, [token])

  return (
    <div>
      <PageHeader
        title="Enquiries"
        subtitle={`${total} total submission${total !== 1 ? 's' : ''} received`}
      />
      <Alert type="error" message={error} />

      {enquiries.length === 0 && !error ? (
        <p className="text-sm text-[#4A4F66]">No enquiries submitted yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {enquiries.map(e => (
            <div
              key={e.id}
              className="glass-card px-5 py-4 cursor-pointer hover:border-accent/30 transition-colors"
              onClick={() => setSelected(selected?.id === e.id ? null : e)}
            >
              {/* Summary row */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#F0F0F5]">{e.full_name}</p>
                  <p className="text-xs text-[#8A8FA8]">
                    {e.company_name} · {e.job_title}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[#4A4F66]">
                    {new Date(e.submitted_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-[#8A8FA8]">{e.email}</p>
                </div>
                <span className="text-[#4A4F66] text-sm flex-shrink-0">
                  {selected?.id === e.id ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded detail */}
              {selected?.id === e.id && (
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Full name',    value: e.full_name    },
                    { label: 'Email',        value: e.email        },
                    { label: 'Phone',        value: e.phone        },
                    { label: 'Company',      value: e.company_name },
                    { label: 'Country',      value: e.country      },
                    { label: 'Job title',    value: e.job_title    },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] uppercase tracking-wider
                                    text-[#4A4F66] mb-0.5">{label}</p>
                      <p className="text-sm text-[#F0F0F5]">{value}</p>
                    </div>
                  ))}
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase tracking-wider
                                  text-[#4A4F66] mb-0.5">Job details</p>
                    <p className="text-sm text-[#8A8FA8] leading-relaxed">
                      {e.job_details}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
