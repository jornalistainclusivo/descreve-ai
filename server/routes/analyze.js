const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Pool } = require('pg');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Database Connection (reusing env vars)
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/analyze', upload.single('image'), async (req, res) => {
    console.log('Tentando usar API Key:', process.env.GEMINI_API_KEY ? 'Chave Presente' : 'Chave Ausente');
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Chave da API do Gemini não configurada' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }

        // 1. Prepare image for Gemini
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-pro",
            generationConfig: { responseMimeType: "application/json" }
        });

        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype,
            },
        };

        // 2. Generate content
        const prompt = `Analise esta imagem e retorne APENAS um objeto JSON com a seguinte estrutura, sem markdown:
        {
          "alt_text": "Texto alternativo curto (máx 125 chars) focado em WCAG.",
          "detailed_description": "Descrição visual completa e detalhada.",
          "seo_keywords": ["lista", "de", "5", "tags", "relevantes"],
          "accessibility_analysis": "Dicas breves sobre contraste e clareza da imagem.",
          "social_post": "Legenda cativante para Instagram/LinkedIn com emojis."
        }`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const jsonText = response.text();

        // Parse JSON to ensure it's valid before saving/sending
        const analysisData = JSON.parse(jsonText);

        // 3. Save to Database
        const client = await pool.connect();
        try {
            // Ensure table exists
            await client.query(`
        CREATE TABLE IF NOT EXISTS descriptions (
          id SERIAL PRIMARY KEY,
          image_name TEXT,
          ai_text TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

            // Insert record (saving JSON as string in ai_text column)
            const insertQuery = 'INSERT INTO descriptions (image_name, ai_text) VALUES ($1, $2) RETURNING *';
            const dbResult = await client.query(insertQuery, [req.file.originalname, JSON.stringify(analysisData)]);

            res.json({
                success: true,
                data: analysisData,
                db_record: dbResult.rows[0]
            });
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Erro na análise:', error);
        res.status(500).json({
            error: 'Erro ao processar imagem',
            details: error.message
        });
    }
});

module.exports = router;
