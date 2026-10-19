import { useState } from 'react'
import { empruntsAPI } from '../api'
import { useToast } from '../context/ToastContext'

export default function BookModal({ book, onClose, onRefresh }) {
  const toast = useToast()
  const [emprunteur, setEmprunteur] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmprunt = async () => {
    if (!emprunteur.trim()) return toast('Entrez un nom d\'emprunteur', 'error')
    setLoading(true)
    try {
      await empruntsAPI.create({ livre_id: book.id, emprunteur_nom: emprunteur })
      toast(`"${book.titre}" emprunté par ${emprunteur}`)
      onRefresh()
      onClose()
    } catch (e) {
      toast(e.response?.data?.error || 'Erreur lors de l\'emprunt', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{book.titre}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-detail"><strong>Auteur</strong>{book.auteur}</div>
          <div className="modal-detail"><strong>ISBN</strong>{book.isbn || '—'}</div>
          <div className="modal-detail"><strong>Année</strong>{book.annee_publication || '—'}</div>
          <div className="modal-detail"><strong>Genre</strong>{book.genre || '—'}</div>
          <div className="modal-detail">
            <strong>Statut</strong>
            <span className={`badge ${book.disponible ? 'badge-success' : 'badge-danger'}`}>
              {book.disponible ? 'Disponible' : 'Emprunté'}
            </span>
          </div>
          {book.description && <p className="modal-desc">{book.description}</p>}

          {book.disponible && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(15,14,10,0.08)' }}>
              <div className="form-group">
                <label className="form-label">Nom de l'emprunteur</label>
                <input
                  className="form-input"
                  value={emprunteur}
                  onChange={e => setEmprunteur(e.target.value)}
                  placeholder="Ex: Jean Dupont"
                  onKeyDown={e => e.key === 'Enter' && handleEmprunt()}
                />
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Fermer</button>
          {book.disponible && (
            <button className="btn btn-primary" onClick={handleEmprunt} disabled={loading}>
              {loading ? 'En cours...' : '📖 Emprunter'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
