require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("🔍 Perguntando ao Google quais modelos estão disponíveis...");

fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("❌ Erro:", data.error.message);
        } else {
            console.log("✅ Modelos Disponíveis:");
            // Filtra apenas os que geram conteúdo e lista os nomes
            const models = data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace("models/", "")); // Limpa o nome para ficar fácil de copiar

            console.table(models);
            console.log("\n👉 DICA: Copie um desses nomes exatos para o seu arquivo analyze.js");
        }
    })
    .catch(err => console.error("Erro fatal:", err));