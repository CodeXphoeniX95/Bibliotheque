import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { livresAPI } from '../api'
import BookCard from '../components/BookCard'
import BookModal from '../components/BookModal'

const GENRES = ['Tous', 'Roman', 'Science', 'Histoire', 'Philosophie', 'Informatique', 'Art', 'Autre']

export default function Livres() {
  const [livres, setLivres] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [genre, setGenre] = useState('Tous')
  const [dispo, setDispo] = useState(false)
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') || ''

  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (genre !== 'Tous') params.genre = genre
      if (dispo) params.disponible = true
      const res = await livresAPI.getAll(params)
      setLivres(res.data)
    } catch { setLivres([]) }
    setLoading(false)
  }

  useEffect(() => { load() }, [search, genre, dispo])

  return (
    <div className="main-content">
      <div className="section-header">
        <h2 className="section-title">Catalogue des livres</h2>
        <span style={{ fontSize: '0.85rem', color: 'rgba(15,14,10,0.5)' }}>{livres.length} résultat(s)</span>
      </div>

      {search && (
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'rgba(15,14,10,0.6)' }}>
          Résultats pour : <strong>"{search}"</strong>
        </p>
      )}

      <div className="filters-bar">
        {GENRES.map(g => (
          <button key={g} className={`filter-btn ${genre === g ? 'active' : ''}`} onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button className={`filter-btn ${dispo ? 'active' : ''}`} onClick={() => setDispo(!dispo)}>
          ✓ Disponibles seulement
        </button>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"/></div>
      ) : livres.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <h3>Aucun livre trouvé</h3>
          <p>Essayez de modifier vos filtres ou votre recherche.</p>
        </div>
      ) : (
        <div className="book-grid">
          {livres.map(b => <BookCard key={b.id} book={b} onClick={setSelected} />)}
        </div>
      )}

      {selected && <BookModal book={selected} onClose={() => setSelected(null)} onRefresh={load} />}
    </div>
  )
}
