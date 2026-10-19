import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Livres from './pages/Livres'
import Emprunts from './pages/Emprunts'
import Admin from './pages/Admin'
import { ToastProvider } from './context/ToastContext'

export default function App() {
  return (
    <ToastProvider>
      <div className="app-wrapper">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/livres" element={<Livres />} />
            <Route path="/emprunts" element={<Emprunts />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="footer">
          © 2025 <span>BiblioThèque</span> — Développé avec React + Node.js + Cloud SQL
        </footer>
      </div>
    </ToastProvider>
  )
}
