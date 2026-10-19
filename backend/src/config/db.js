const { Pool } = require('pg')
require('dotenv').config()

const isProduction = process.env.NODE_ENV === 'production'

const config = isProduction
  ? {
      // Cloud SQL via Unix socket (Cloud Run)
      host: process.env.DB_HOST,   // /cloudsql/PROJECT:REGION:INSTANCE
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 5
    }
  : {
      // Développement local
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'bibliotheque',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      max: 10
    }

const pool = new Pool(config)

pool.on('error', (err) => {
  console.error('Erreur PostgreSQL inattendue:', err)
})

module.exports = pool
