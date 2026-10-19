const express = require('express')
const router = express.Router()
const db = require('../config/db')

// GET /api/emprunts
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.*, l.titre as livre_titre, l.auteur as livre_auteur
      FROM emprunts e
      JOIN livres l ON e.livre_id = l.id
      ORDER BY e.date_emprunt DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/emprunts — créer un emprunt
router.post('/', async (req, res) => {
  const { livre_id, emprunteur_nom } = req.body
  if (!livre_id || !emprunteur_nom) return res.status(400).json({ error: 'livre_id et emprunteur_nom requis' })

  const client = await db.connect()
  try {
    await client.query('BEGIN')
    const livreRes = await client.query('SELECT disponible FROM livres WHERE id=$1 FOR UPDATE', [livre_id])
    if (!livreRes.rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Livre non trouvé' }) }
    if (!livreRes.rows[0].disponible) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Livre non disponible' }) }

    await client.query('UPDATE livres SET disponible=FALSE WHERE id=$1', [livre_id])
    const empruntRes = await client.query(
      `INSERT INTO emprunts (livre_id, emprunteur_nom) VALUES ($1, $2) RETURNING *`,
      [livre_id, emprunteur_nom]
    )
    await client.query('COMMIT')
    res.status(201).json(empruntRes.rows[0])
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: 'Erreur serveur' })
  } finally {
    client.release()
  }
})

// PUT /api/emprunts/:id/retour — retourner un livre
router.put('/:id/retour', async (req, res) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    const empruntRes = await client.query('SELECT * FROM emprunts WHERE id=$1 FOR UPDATE', [req.params.id])
    if (!empruntRes.rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Emprunt non trouvé' }) }
    if (empruntRes.rows[0].date_retour) { await client.query('ROLLBACK'); return res.status(400).json({ error: 'Déjà retourné' }) }

    await client.query('UPDATE emprunts SET date_retour=NOW() WHERE id=$1', [req.params.id])
    await client.query('UPDATE livres SET disponible=TRUE WHERE id=$1', [empruntRes.rows[0].livre_id])
    await client.query('COMMIT')
    res.json({ message: 'Retour enregistré' })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: 'Erreur serveur' })
  } finally {
    client.release()
  }
})

module.exports = router
