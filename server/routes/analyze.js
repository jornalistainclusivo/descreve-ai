const express = require('express');
const router = express.Router();
const multer = require('multer');

const prisma = require('../lib/prisma');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.post('/analyze', upload.single('image'), async (req, res) => {

    try {
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ error: 'Chave da API da OpenAI não configurada' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }

        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // 1. Prepare image for OpenAI
        const base64Image = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

        // 2. Generate content
        const prompt = `Analise esta imagem e retorne APENAS um objeto JSON com a seguinte estrutura, sem markdown:
        {
          "alt_text": "Texto alternativo curto (máx 125 chars) focado em WCAG.",
          "detailed_description": "Descrição visual completa e detalhada.",
          "seo_keywords": ["lista", "de", "5", "tags", "relevantes"],
          "accessibility_analysis": "Dicas breves sobre contraste e clareza da imagem.",
          "social_post": "Legenda cativante para Instagram/LinkedIn com emojis."
        }`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                "url": dataUrl,
                            },
                        },
                    ],
                },
            ],
            response_format: { type: "json_object" },
            max_tokens: 1000,
        });

        const jsonText = response.choices[0].message.content;

        // Parse JSON to ensure it's valid before saving/sending
        const analysisData = JSON.parse(jsonText);

        // 3. Save to Database using Prisma
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
