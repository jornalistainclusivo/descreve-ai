require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const prisma = require('./lib/prisma');

const app = express();
const port = process.env.PORT || 3000;

// Security Middleware (OWASP)
app.use(helmet());

// Rate Limiter
const isDev = process.env.NODE_ENV !== 'production';
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: isDev ? 1000 : 50, // 1000 requests em Dev, restrito para 50 em Produção
    message: { error: "SECURITY_BLOCK: Muitas requisições deste IP. Tente novamente mais tarde." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use('/api/', apiLimiter);
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
}));
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
