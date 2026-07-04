// src/pages/admin/AdminPastWork.jsx
import { useState, useEffect } from 'react'
import {
  PageHeader, Table, Tr, Td, EditBtn, DeleteBtn,
  Modal, FormField, Input, Textarea, Alert,
} from '../../components/admin/AdminUI'

const EMPTY = { title: '', industry: '', description: '', icon: '', year: '' }

export default function AdminPastWork() {
  const [items, setItems]     = useState([])
  const [modal, setModal]     = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const token = localStorage.getItem('admin_token')
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  async function load() {
    const res  = await fetch('/api/past-work')
    const data = await res.json()
    setItems(data.data ?? [])
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(EMPTY); setEditId(null); setModal('create') }
  function openEdit(item) {
    setForm({ title: item.title, industry: item.industry,
              description: item.description, icon: item.icon ?? '',
              year: item.year ?? '' })
    setEditId(item.id); setModal('edit')
  }
  function closeModal() { setModal(null); setError('') }
  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  async function handleSave() {
    if (!form.title || !form.industry || !form.description) {
      setError('Title, industry, and description are required.'); return
    }
    try {
      const url    = editId ? `/api/past-work/${editId}` : '/api/past-work'
      const method = editId ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      closeModal(); setSuccess(editId ? 'Entry updated.' : 'Entry created.')
      load(); setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Could not save entry.') }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this entry?')) return
    await fetch(`/api/past-work/${id}`, { method: 'DELETE', headers })
    setSuccess('Entry deleted.'); load(); setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div>
      <PageHeader title="Past Work" subtitle="Manage case studies shown on the public site"
        action={<button className="btn-primary text-sm px-5 py-2" onClick={openCreate}>+ Add entry</button>}
      />
      <Alert type="success" message={success} />
      <Alert type="error"   message={error && !modal ? error : ''} />

      <Table headers={['Title', 'Industry', 'Year', 'Actions']}>
        {items.map(item => (
          <Tr key={item.id}>
            <Td className="font-medium text-[#F0F0F5]">
              {item.icon && <span className="mr-2">{item.icon}</span>}{item.title}
            </Td>
            <Td>{item.industry}</Td>
            <Td>{item.year ?? '—'}</Td>
            <Td><EditBtn onClick={() => openEdit(item)} /><DeleteBtn onClick={() => handleDelete(item.id)} /></Td>
          </Tr>
        ))}
      </Table>

      {modal && (
        <Modal title={modal === 'create' ? 'Add past work' : 'Edit past work'} onClose={closeModal}>
          <Alert type="error" message={error} />
          <FormField label="Title *"><Input name="title" value={form.title} onChange={handleChange} placeholder="Project title" /></FormField>
          <FormField label="Industry *"><Input name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Healthcare" /></FormField>
          <FormField label="Description *"><Textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the project and outcome..." /></FormField>
          <FormField label="Icon (emoji)"><Input name="icon" value={form.icon} onChange={handleChange} placeholder="e.g. 🏥" /></FormField>
          <FormField label="Year"><Input name="year" type="number" value={form.year} onChange={handleChange} placeholder="e.g. 2024" /></FormField>
          <div className="flex gap-3 justify-end mt-2">
            <button className="btn-ghost text-sm px-5 py-2" onClick={closeModal}>Cancel</button>
            <button className="btn-primary text-sm px-5 py-2" onClick={handleSave}>{modal === 'create' ? 'Create' : 'Save changes'}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
