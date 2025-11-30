const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../lib/prisma');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

        // 3. Save to Database using Prisma
        // Note: We are saving the individual fields now instead of a raw JSON blob, 
        // or we could map them to the schema we defined.
        // The schema has: imageName, altText, detailedDescription, seoKeywords, accessibilityAnalysis, socialPost

        const dbRecord = await prisma.description.create({
            data: {
                imageName: req.file.originalname,
                altText: analysisData.alt_text,
                detailedDescription: analysisData.detailed_description,
                seoKeywords: JSON.stringify(analysisData.seo_keywords), // Storing array as string/JSON
                accessibilityAnalysis: analysisData.accessibility_analysis,
                socialPost: analysisData.social_post
            }
        });

        res.json({
            success: true,
            data: analysisData,
            db_record: dbRecord
        });

    } catch (error) {
        console.error('Erro na análise:', error);
        res.status(500).json({
            error: 'Erro ao processar imagem',
            details: error.message
        });
    }
});

module.exports = router;
