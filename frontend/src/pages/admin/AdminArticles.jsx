// src/pages/admin/AdminArticles.jsx
import { useState, useEffect } from 'react'
import {
  PageHeader, Table, Tr, Td, EditBtn, DeleteBtn,
  Modal, FormField, Input, Textarea, Alert,
} from '../../components/admin/AdminUI'

const EMPTY = { title: '', excerpt: '', content: '', category: '', author: '' }

export default function AdminArticles() {
  const [items, setItems]     = useState([])
  const [modal, setModal]     = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const token = localStorage.getItem('admin_token')
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  async function load() {
    const res  = await fetch('/api/articles')
    const data = await res.json()
    setItems(data.data ?? [])
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(EMPTY); setEditId(null); setModal('create') }
  function openEdit(item) {
    setForm({ title: item.title, excerpt: item.excerpt,
              content: item.content ?? '', category: item.category ?? '',
              author: item.author ?? '' })
    setEditId(item.id); setModal('edit')
  }
  function closeModal() { setModal(null); setError('') }
  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  async function handleSave() {
    if (!form.title || !form.excerpt) {
      setError('Title and excerpt are required.'); return
    }
    try {
      const url    = editId ? `/api/articles/${editId}` : '/api/articles'
      const method = editId ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      closeModal(); setSuccess(editId ? 'Article updated.' : 'Article created.')
      load(); setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Could not save article.') }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this article?')) return
    await fetch(`/api/articles/${id}`, { method: 'DELETE', headers })
    setSuccess('Article deleted.'); load(); setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div>
      <PageHeader title="Articles" subtitle="Manage promotional articles on the public site"
        action={<button className="btn-primary text-sm px-5 py-2" onClick={openCreate}>+ Add article</button>}
      />
      <Alert type="success" message={success} />
      <Alert type="error"   message={error && !modal ? error : ''} />

      <Table headers={['Title', 'Category', 'Author', 'Actions']}>
        {items.map(item => (
          <Tr key={item.id}>
            <Td className="font-medium text-[#F0F0F5] max-w-xs truncate">{item.title}</Td>
            <Td>{item.category ?? '—'}</Td>
            <Td>{item.author   ?? '—'}</Td>
            <Td><EditBtn onClick={() => openEdit(item)} /><DeleteBtn onClick={() => handleDelete(item.id)} /></Td>
          </Tr>
        ))}
      </Table>

      {modal && (
        <Modal title={modal === 'create' ? 'Add article' : 'Edit article'} onClose={closeModal}>
          <Alert type="error" message={error} />
          <FormField label="Title *"><Input name="title" value={form.title} onChange={handleChange} placeholder="Article title" /></FormField>
          <FormField label="Excerpt *"><Textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Short summary shown on the articles page..." /></FormField>
          <FormField label="Full content"><Textarea name="content" value={form.content} onChange={handleChange} placeholder="Full article body (optional)..." /></FormField>
          <FormField label="Category"><Input name="category" value={form.category} onChange={handleChange} placeholder="e.g. AI Strategy" /></FormField>
          <FormField label="Author"><Input name="author" value={form.author} onChange={handleChange} placeholder="Author name" /></FormField>
          <div className="flex gap-3 justify-end mt-2">
            <button className="btn-ghost text-sm px-5 py-2" onClick={closeModal}>Cancel</button>
            <button className="btn-primary text-sm px-5 py-2" onClick={handleSave}>{modal === 'create' ? 'Create' : 'Save changes'}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
