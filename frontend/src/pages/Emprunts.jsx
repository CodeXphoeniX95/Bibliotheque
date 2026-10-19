import { useState, useEffect } from 'react'
import { empruntsAPI } from '../api'
import { useToast } from '../context/ToastContext'

export default function Emprunts() {
  const [emprunts, setEmprunts] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const load = async () => {
    try {
      const res = await empruntsAPI.getAll()
      setEmprunts(res.data)
    } catch { setEmprunts([]) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleRetour = async (id, titre) => {
    try {
      await empruntsAPI.retourner(id)
      toast(`"${titre}" retourné avec succès`)
      load()
    } catch (e) {
      toast(e.response?.data?.error || 'Erreur', 'error')
    }
  }

  const actifs = emprunts.filter(e => !e.date_retour)
  const historique = emprunts.filter(e => e.date_retour)

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—'

  const isEnRetard = (e) => !e.date_retour && new Date(e.date_retour_prevue) < new Date()

  return (
    <div className="main-content">
      <div className="section-header">
        <h2 className="section-title">Emprunts actifs</h2>
        <span style={{ fontSize: '0.85rem', color: 'rgba(15,14,10,0.5)' }}>{actifs.length} en cours</span>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"/></div>
      ) : actifs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">✓</span>
          <h3>Aucun emprunt en cours</h3>
          <p>Tous les livres sont disponibles.</p>
        </div>
      ) : (
        <div className="table-wrapper" style={{ marginBottom: '3rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Livre</th>
                <th>Emprunteur</th>
                <th>Date emprunt</th>
                <th>Retour prévu</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {actifs.map(e => (
                <tr key={e.id}>
                  <td><strong>{e.livre_titre}</strong></td>
                  <td>{e.emprunteur_nom}</td>
                  <td>{formatDate(e.date_emprunt)}</td>
                  <td>{formatDate(e.date_retour_prevue)}</td>
                  <td>
                    {isEnRetard(e) ? (
                      <span className="badge badge-danger">En retard</span>
                    ) : (
                      <span className="badge badge-warning">En cours</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => handleRetour(e.id, e.livre_titre)}>
                      Retourner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {historique.length > 0 && (
        <>
          <div className="section-header">
            <h2 className="section-title">Historique</h2>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Livre</th><th>Emprunteur</th><th>Emprunté le</th><th>Retourné le</th></tr>
              </thead>
              <tbody>
                {historique.map(e => (
                  <tr key={e.id}>
                    <td>{e.livre_titre}</td>
                    <td>{e.emprunteur_nom}</td>
                    <td>{formatDate(e.date_emprunt)}</td>
                    <td><span className="badge badge-success">{formatDate(e.date_retour)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
