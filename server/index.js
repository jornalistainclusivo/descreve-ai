require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const analyzeRoute = require('./routes/analyze');
app.use('/api', analyzeRoute);

app.get('/api/status', async (req, res) => {
  try {
    // Test DB connection
    await prisma.$connect();
    // Optional: Run a simple query
    const result = await prisma.$queryRaw`SELECT NOW()`;

    res.json({
      status: 'Sucesso',
      message: 'Conectado ao Banco de Dados (Prisma)',
      timestamp: result[0].now
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
