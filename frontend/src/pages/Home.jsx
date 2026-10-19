import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { livresAPI, statsAPI } from '../api'
import BookCard from '../components/BookCard'
import BookModal from '../components/BookModal'

export default function Home() {
  const [livres, setLivres] = useState([])
  const [stats, setStats] = useState({ total: 0, disponibles: 0, empruntes: 0 })
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const [lr, sr] = await Promise.all([livresAPI.getAll({ limit: 8 }), statsAPI.get()])
      setLivres(lr.data)
      setStats(sr.data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <>
      <div className="page-hero">
        <div className="hero-inner">
          <h1 className="hero-title">
            Votre <em>Bibliothèque</em><br />Numérique
          </h1>
          <p className="hero-subtitle">
            Gérez vos collections, suivez les emprunts et explorez des milliers d'ouvrages.
          </p>
          <div className="hero-stats">
            <div>
              <span className="hero-stat-value">{stats.total}</span>
              <span className="hero-stat-label">Livres</span>
            </div>
            <div>
              <span className="hero-stat-value">{stats.disponibles}</span>
              <span className="hero-stat-label">Disponibles</span>
            </div>
            <div>
              <span className="hero-stat-value">{stats.empruntes}</span>
              <span className="hero-stat-label">Emprunts actifs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="section-header">
          <h2 className="section-title">Récents ajouts</h2>
          <Link to="/livres" className="section-link">Voir tout →</Link>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"/></div>
        ) : livres.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📚</span>
            <h3>Aucun livre pour l'instant</h3>
            <p>Commencez par ajouter des livres via l'espace Admin.</p>
          </div>
        ) : (
          <div className="book-grid">
            {livres.map(b => <BookCard key={b.id} book={b} onClick={setSelected} />)}
          </div>
        )}
      </div>

      {selected && <BookModal book={selected} onClose={() => setSelected(null)} onRefresh={load} />}
    </>
  )
}
