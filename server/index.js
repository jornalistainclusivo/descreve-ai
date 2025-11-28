require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Routes
const analyzeRoute = require('./routes/analyze');
app.use('/api', analyzeRoute);
app.get('/api/status', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({
      status: 'Sucesso',
      message: 'Conectado ao PostgreSQL',
      timestamp: result.rows[0].now
    });
  } catch (err) {
    console.error('Erro ao conectar no banco:', err);
    res.status(500).json({
      status: 'Erro',
      message: 'Falha na conexão com o banco de dados',
      error: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
