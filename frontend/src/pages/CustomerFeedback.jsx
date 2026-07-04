import { useState } from 'react'
import useFetch from '../hooks/useFetch'
import SkeletonCard from '../components/skeleton/SkeletonCard'

// Expected API shape: GET /api/feedback
// [{ id, feedback_text, rating (1-5), customer_name, company_name, job_title }]

function StarRating({ rating }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-[#4A4F66]'}`}>
          ★
        </span>
      ))}
    </div>
  )
}

const AVATAR_GRADIENTS = [
  'from-accent to-[#00D4AA]',
  'from-[#FF6B6B] to-yellow-400',
  'from-[#00D4AA] to-blue-500',
  'from-purple-500 to-accent',
]

function initials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function CustomerFeedback() {
  const { data: feedback, loading, error } = useFetch('/api/feedback')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ feedback_text: '', rating: 5, customer_name: '', company_name: '', job_title: '' })
  const [submitState, setSubmitState] = useState({ loading: false, error: '', success: '' })

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitState({ loading: true, error: '', success: '' })
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: Number(form.rating) })
      })
      if (!res.ok) throw new Error('Failed to submit feedback')
      setSubmitState({ loading: false, error: '', success: 'Thank you! Your feedback is pending verification.' })
      setTimeout(() => {
        setShowModal(false)
        setSubmitState({ loading: false, error: '', success: '' })
        setForm({ feedback_text: '', rating: 5, customer_name: '', company_name: '', job_title: '' })
      }, 3000)
    } catch (err) {
      setSubmitState({ loading: false, error: err.message, success: '' })
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <p className="section-label">Customer feedback</p>
      <h1 className="section-title">What our clients<br />say</h1>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div>
          <p className="text-[#8A8FA8] text-base leading-relaxed max-w-xl">
            Feedback submitted following project completion. Ratings are verified by
            the admin team.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-accent/20"
        >
          Submit Feedback
        </button>
      </div>

      {error && (
        <p className="text-[#FF6B6B] text-sm mb-8">
          Could not load feedback. Please try again later.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} type="feedback" />)
          : feedback.map((f, i) => (
            <div key={f.id} className="glass-card p-6">
              <StarRating rating={f.rating} />
              <p className="text-sm text-[#8A8FA8] leading-relaxed mb-5 italic">
                "{f.feedback_text}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                 text-sm font-bold text-white flex-shrink-0
                                 bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}`}>
                  {initials(f.customer_name)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{f.customer_name}</p>
                  <p className="text-[11px] text-[#4A4F66]">
                    {f.job_title}{f.company_name ? `, ${f.company_name}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-8 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
            <h2 className="font-display text-2xl font-bold mb-6 text-gray-900">Submit Feedback</h2>
            
            {submitState.success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4 font-semibold">
                {submitState.success}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitState.error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{submitState.error}</div>
                )}
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                  <input required name="customer_name" value={form.customer_name} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="John Doe" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                    <input name="company_name" value={form.company_name} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="Acme Corp" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
                    <input name="job_title" value={form.job_title} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="Director" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Rating *</label>
                  <select name="rating" value={form.rating} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white">
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback *</label>
                  <textarea required name="feedback_text" value={form.feedback_text} onChange={handleChange} rows="4" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" placeholder="Your experience working with us..." />
                </div>

                <button 
                  disabled={submitState.loading}
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-white font-bold px-4 py-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
                >
                  {submitState.loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
