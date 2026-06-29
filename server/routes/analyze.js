const express = require('express');
const router = express.Router();
const multer = require('multer');

const prisma = require('../lib/prisma');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB aprovado
    fileFilter: (req, file, cb) => {
        // Strict file type validation (Apenas Imagens)
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('SECURITY_ERROR: Arquivo inválido. Apenas imagens são permitidas.'));
        }
    }
});


const authMiddleware = require('../middleware/auth');

router.post('/analyze', authMiddleware, upload.single('image'), async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }
        
        const aiGateway = require('../services/aiGateway');

        // 1. Prepare image for OpenAI
        const base64Image = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;
        
        console.log(`[API] Imagem recebida: ${req.file.originalname}, Tamanho: ${req.file.size} bytes, Mime: ${req.file.mimetype}`);
        if (base64Image.length < 100) {
            throw new Error(`Imagem corrompida ou muito pequena (Base64 length: ${base64Image.length})`);
        }

        // 2. Generate content via Gateway
        const prompt = `Analise esta imagem e retorne APENAS um objeto JSON válido, com a seguinte estrutura:
{
  "alt_text": "Texto alternativo curto (máx 125 chars).",
  "detailed_description": "Descrição visual completa e detalhada.",
  "seo_keywords": ["keyword1", "keyword2"],
  "accessibility_analysis": "Dicas breves de contraste.",
  "social_post": "Legenda cativante."
}`;

        console.log(`[API] Solicitando análise à IA...`);
        const analysisData = await aiGateway.analyzeImage(dataUrl, prompt);

        // Validação da saída da IA
        if (!analysisData.alt_text) {
             throw new Error("IA retornou JSON inválido (alt_text ausente).");
        }

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

        console.log(`[API] Sucesso! IA gerou o Alt Text: "${analysisData.alt_text}"`);
        console.log(`[API] Enviando resposta para o WordPress (DB ID: ${dbRecord.id})...`);

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
