const express = require('express')
const router = express.Router()
const db = require('../config/db')

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE TRUE) AS total,
        COUNT(*) FILTER (WHERE disponible = TRUE) AS disponibles,
        COUNT(*) FILTER (WHERE disponible = FALSE) AS empruntes
      FROM livres
    `)
    const row = result.rows[0]
    res.json({
      total: parseInt(row.total),
      disponibles: parseInt(row.disponibles),
      empruntes: parseInt(row.empruntes)
    })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

module.exports = router
