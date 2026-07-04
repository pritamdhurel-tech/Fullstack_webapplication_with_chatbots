// src/pages/admin/AdminFeedback.jsx
import { useState, useEffect } from 'react'
import {
  PageHeader, Table, Tr, Td, EditBtn, DeleteBtn,
  Modal, FormField, Input, Textarea, Select, Alert, Stars,
} from '../../components/admin/AdminUI'

const EMPTY = { feedback_text: '', rating: 5, customer_name: '', company_name: '', job_title: '' }

export default function AdminFeedback() {
  const [items, setItems]     = useState([])
  const [modal, setModal]     = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const token = localStorage.getItem('admin_token')
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  async function load() {
    try {
      const res  = await fetch('/api/feedback/admin', { headers })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error || `Server error: ${res.status}`)
      }
      const data = await res.json()
      setItems(data.data ?? [])
    } catch (err) {
      console.error('Failed to load feedback:', err)
      setError(err.message || 'Could not load feedback.')
    }
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(EMPTY); setEditId(null); setModal('create') }
  function openEdit(item) {
    setForm({ feedback_text: item.feedback_text, rating: item.rating,
              customer_name: item.customer_name, company_name: item.company_name ?? '',
              job_title: item.job_title ?? '' })
    setEditId(item.id); setModal('edit')
  }
  function closeModal() { setModal(null); setError('') }
  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  async function handleSave() {
    if (!form.feedback_text || !form.customer_name) {
      setError('Feedback text and customer name are required.'); return
    }
    try {
      const url    = editId ? `/api/feedback/${editId}` : '/api/feedback'
      const method = editId ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers,
        body: JSON.stringify({ ...form, rating: Number(form.rating) }) })
      if (!res.ok) throw new Error()
      closeModal(); setSuccess(editId ? 'Feedback updated.' : 'Feedback created.')
      load(); setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Could not save feedback.') }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this feedback?')) return
    await fetch(`/api/feedback/${id}`, { method: 'DELETE', headers })
    setSuccess('Feedback deleted.'); load(); setTimeout(() => setSuccess(''), 3000)
  }

  async function handleToggleApprove(id, currentStatus) {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'reject' : 'approve'} this feedback?`)) return
    try {
      const res = await fetch(`/api/feedback/${id}/approve`, { method: 'PATCH', headers })
      if (!res.ok) throw new Error()
      setSuccess(`Feedback ${currentStatus ? 'rejected' : 'approved'}.`)
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Could not update approval status.')
    }
  }

  return (
    <div>
      <PageHeader title="Customer Feedback" subtitle="Manage testimonials displayed on the public site"
        action={<button className="btn-primary text-sm px-5 py-2" onClick={openCreate}>+ Add feedback</button>}
      />
      <Alert type="success" message={success} />
      <Alert type="error"   message={error && !modal ? error : ''} />

      <Table headers={['Customer', 'Rating', 'Status', 'Feedback', 'Actions']}>
        {items.map(item => (
          <Tr key={item.id}>
            <Td className="font-medium text-[#F0F0F5]">
              <div>{item.customer_name}</div>
              <div className="text-xs text-[#4A4F66]">{item.company_name}</div>
            </Td>
            <Td><Stars rating={item.rating} /></Td>
            <Td>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${item.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {item.is_approved ? 'Approved' : 'Pending'}
              </span>
            </Td>
            <Td className="max-w-xs truncate text-sm">"{item.feedback_text}"</Td>
            <Td>
              <button 
                onClick={() => handleToggleApprove(item.id, item.is_approved)}
                className={`text-xs px-3 py-1 rounded mr-2 font-semibold transition-colors ${item.is_approved ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/30' : 'bg-[#00D4AA]/20 text-[#00D4AA] hover:bg-[#00D4AA]/30'}`}
              >
                {item.is_approved ? 'Reject' : 'Approve'}
              </button>
              <EditBtn onClick={() => openEdit(item)} />
              <DeleteBtn onClick={() => handleDelete(item.id)} />
            </Td>
          </Tr>
        ))}
      </Table>

      {modal && (
        <Modal title={modal === 'create' ? 'Add feedback' : 'Edit feedback'} onClose={closeModal}>
          <Alert type="error" message={error} />
          <FormField label="Customer name *"><Input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Full name" /></FormField>
          <FormField label="Company name"><Input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Organisation" /></FormField>
          <FormField label="Job title"><Input name="job_title" value={form.job_title} onChange={handleChange} placeholder="e.g. CTO" /></FormField>
          <FormField label="Rating *">
            <Select name="rating" value={form.rating} onChange={handleChange}>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} star{r !== 1 ? 's' : ''}</option>)}
            </Select>
          </FormField>
          <FormField label="Feedback text *"><Textarea name="feedback_text" value={form.feedback_text} onChange={handleChange} placeholder="Customer's feedback..." /></FormField>
          <div className="flex gap-3 justify-end mt-2">
            <button className="btn-ghost text-sm px-5 py-2" onClick={closeModal}>Cancel</button>
            <button className="btn-primary text-sm px-5 py-2" onClick={handleSave}>{modal === 'create' ? 'Create' : 'Save changes'}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
