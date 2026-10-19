require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const livresRouter = require('./routes/livres')
const empruntsRouter = require('./routes/emprunts')
const statsRouter = require('./routes/stats')

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

// Routes API
app.use('/api/livres', livresRouter)
app.use('/api/emprunts', empruntsRouter)
app.use('/api/stats', statsRouter)

// Health check (requis par Cloud Run)
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// Servir le frontend React en production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(frontendPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`)
})

module.exports = app
