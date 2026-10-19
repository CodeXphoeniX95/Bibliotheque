import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/livres?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="header">
      <NavLink to="/" className="header-brand">
        <div className="logo-icon">📚</div>
        <span className="brand-text">Biblio<span>Thèque</span></span>
      </NavLink>

      <form className="header-search" onSubmit={handleSearch}>
        <span style={{ opacity: 0.5, fontSize: '0.9rem' }}>🔍</span>
        <input
          type="text"
          placeholder="Rechercher un livre..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </form>

      <nav className="header-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Accueil</NavLink>
        <NavLink to="/livres" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Livres</NavLink>
        <NavLink to="/emprunts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Emprunts</NavLink>
        <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Admin</NavLink>
      </nav>
    </header>
  )
}
