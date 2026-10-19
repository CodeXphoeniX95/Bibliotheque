const express = require('express')
const router = express.Router()
const db = require('../config/db')

// GET /api/livres — liste avec filtres
router.get('/', async (req, res) => {
  try {
    const { search, genre, disponible, limit } = req.query
    let query = 'SELECT * FROM livres WHERE 1=1'
    const params = []

    if (search) {
      params.push(`%${search}%`)
      query += ` AND (titre ILIKE $${params.length} OR auteur ILIKE $${params.length})`
    }
    if (genre) {
      params.push(genre)
      query += ` AND genre = $${params.length}`
    }
    if (disponible === 'true') {
      query += ` AND disponible = TRUE`
    }

    query += ' ORDER BY date_ajout DESC'
    if (limit) { params.push(parseInt(limit)); query += ` LIMIT $${params.length}` }

    const result = await db.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/livres/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM livres WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Livre non trouvé' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/livres
router.post('/', async (req, res) => {
  const { titre, auteur, isbn, annee_publication, genre, description } = req.body
  if (!titre || !auteur) return res.status(400).json({ error: 'Titre et auteur requis' })
  try {
    const result = await db.query(
      `INSERT INTO livres (titre, auteur, isbn, annee_publication, genre, description)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [titre, auteur, isbn || null, annee_publication || null, genre || null, description || null]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'ISBN déjà existant' })
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/livres/:id
router.put('/:id', async (req, res) => {
  const { titre, auteur, isbn, annee_publication, genre, description } = req.body
  try {
    const result = await db.query(
      `UPDATE livres SET titre=$1, auteur=$2, isbn=$3, annee_publication=$4, genre=$5, description=$6
       WHERE id=$7 RETURNING *`,
      [titre, auteur, isbn || null, annee_publication || null, genre || null, description || null, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Livre non trouvé' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/livres/:id
router.delete('/:id', async (req, res) => {
  try {
    const check = await db.query('SELECT disponible FROM livres WHERE id=$1', [req.params.id])
    if (!check.rows[0]) return res.status(404).json({ error: 'Livre non trouvé' })
    if (!check.rows[0].disponible) return res.status(400).json({ error: 'Impossible de supprimer un livre emprunté' })
    await db.query('DELETE FROM livres WHERE id=$1', [req.params.id])
    res.json({ message: 'Supprimé' })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

module.exports = router
