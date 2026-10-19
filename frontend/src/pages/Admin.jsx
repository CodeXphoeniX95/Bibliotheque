import { useState, useEffect } from 'react'
import { livresAPI } from '../api'
import { useToast } from '../context/ToastContext'

const EMPTY = { titre: '', auteur: '', isbn: '', annee_publication: '', genre: '', description: '' }
const GENRES = ['Roman', 'Science', 'Histoire', 'Philosophie', 'Informatique', 'Art', 'Autre']

export default function Admin() {
  const [livres, setLivres] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const load = async () => {
    try { const r = await livresAPI.getAll(); setLivres(r.data) } catch {}
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async () => {
    if (!form.titre || !form.auteur) return toast('Titre et auteur requis', 'error')
    setLoading(true)
    try {
      if (editing) {
        await livresAPI.update(editing, form)
        toast('Livre mis à jour ✓')
      } else {
        await livresAPI.create(form)
        toast('Livre ajouté ✓')
      }
      setForm(EMPTY); setEditing(null); setShowForm(false); load()
    } catch (e) {
      toast(e.response?.data?.error || 'Erreur', 'error')
    }
    setLoading(false)
  }

  const handleEdit = (livre) => {
    setForm({ titre: livre.titre, auteur: livre.auteur, isbn: livre.isbn || '', annee_publication: livre.annee_publication || '', genre: livre.genre || '', description: livre.description || '' })
    setEditing(livre.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id, titre) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return
    try { await livresAPI.delete(id); toast('Livre supprimé'); load() }
    catch (e) { toast(e.response?.data?.error || 'Erreur', 'error') }
  }

  const cancel = () => { setForm(EMPTY); setEditing(null); setShowForm(false) }

  return (
    <div className="main-content">
      <div className="section-header">
        <h2 className="section-title">Administration</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Ajouter un livre</button>
        )}
      </div>

      {showForm && (
        <div style={{ background: 'var(--paper)', border: '1px solid rgba(15,14,10,0.1)', borderRadius: 4, padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
            {editing ? 'Modifier le livre' : 'Nouveau livre'}
          </h3>
          <div className="form-grid">
            {[['titre', 'Titre *', 'text'], ['auteur', 'Auteur *', 'text'], ['isbn', 'ISBN', 'text'], ['annee_publication', 'Année', 'number']].map(([k, l, t]) => (
              <div className="form-group" key={k}>
                <label className="form-label">{l}</label>
                <input className="form-input" type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select className="form-select" value={form.genre} onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}>
                <option value="">—</option>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Résumé du livre..." />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={cancel}>Annuler</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? '...' : editing ? 'Mettre à jour' : 'Ajouter'}</button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Titre</th><th>Auteur</th><th>Genre</th><th>Année</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {livres.map((l, i) => (
              <tr key={l.id}>
                <td style={{ color: 'rgba(15,14,10,0.4)', fontSize: '0.75rem' }}>{i + 1}</td>
                <td><strong>{l.titre}</strong></td>
                <td>{l.auteur}</td>
                <td>{l.genre || '—'}</td>
                <td>{l.annee_publication || '—'}</td>
                <td><span className={`badge ${l.disponible ? 'badge-success' : 'badge-danger'}`}>{l.disponible ? 'Disponible' : 'Emprunté'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }} onClick={() => handleEdit(l)}>Éditer</button>
                    <button className="btn btn-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }} onClick={() => handleDelete(l.id, l.titre)} disabled={!l.disponible}>Suppr.</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
