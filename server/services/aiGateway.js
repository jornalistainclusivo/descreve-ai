const OpenAI = require('openai');

class AiGateway {
    constructor() {
        this.timeoutLimit = 15000; // 15 seconds strict timeout
        this.primaryProvider = process.env.ACTIVE_LLM_PROVIDER || 'openai';
        this.providers = {
            openai: {
                model: 'gpt-4o-mini',
                getEnvKey: () => process.env.OPENAI_API_KEY,
                getBaseUrl: () => undefined // uses default OpenAI base URL
            },
            openrouter1: {
                model: 'google/gemini-2.5-flash',
                getEnvKey: () => process.env.OPENROUTER_API_KEY,
                getBaseUrl: () => 'https://openrouter.ai/api/v1'
            },
            openrouter2: {
                model: 'anthropic/claude-3-haiku',
                getEnvKey: () => process.env.OPENROUTER_API_KEY,
                getBaseUrl: () => 'https://openrouter.ai/api/v1'
            }
        };
    }

    _getClient(providerConfig) {
        const apiKey = providerConfig.getEnvKey();
        if (!apiKey) {
            throw new Error(`API Key missing for configured provider.`);
        }

        const config = { 
            apiKey: apiKey,
            maxRetries: 0 // Fail fast. Não queremos que a SDK retente silenciosamente (causa "hang")
        };
        const baseUrl = providerConfig.getBaseUrl();
        
        if (baseUrl) {
            config.baseURL = baseUrl;
            config.defaultHeaders = {
                'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
                'X-Title': 'Descreve AI Gateway'
            };
        }

        return new OpenAI(config);
    }

    async _attemptAnalysis(providerName, dataUrl, prompt) {
        const config = this.providers[providerName];
        if (!config) throw new Error(`Provider config not found for: ${providerName}`);

        console.log(`[AI Gateway] Modoc active: Attempting analysis with ${providerName} (Model: ${config.model})`);

        try {
            const client = this._getClient(config);
            
            console.log(`[AI Gateway] [${providerName}] Enviando payload para a API (Aguardando resposta...)`);
            
            // Timeout via AbortController (Bulletproof)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeoutLimit);

            const response = await client.chat.completions.create({
                model: config.model,
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: { 
                                    url: dataUrl,
                                    detail: "low"
                                },
                            },
                        ],
                    },
                ],
                response_format: { type: "json_object" },
                max_tokens: 1000,
            }, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log(`[AI Gateway] [${providerName}] Resposta recebida da API!`);

            const content = response.choices[0].message.content;
            if (!content) throw new Error("Empty response from LLM");
            
            return content;

        } catch (error) {
            const isTimeout = error.name === 'AbortError' || error.code === 'ETIMEDOUT' || error.type === 'timeout' || error.message?.toLowerCase().includes('timeout') || error.message?.toLowerCase().includes('aborted');
            
            if (isTimeout) {
                console.error(`[AI Gateway] Timeout on ${providerName} (${this.timeoutLimit}ms exceeded).`);
            } else {
                console.error(`[AI Gateway] Error on ${providerName}:`, error.message);
            }
            throw new Error(`Fallback Trigger`); // Throw specifically to trigger fallback
        }
    }

    async analyzeImage(dataUrl, prompt) {
        // Fallback Chain Strategy: Primary -> Fallback 1 -> Fallback 2
        const chain = [this.primaryProvider === 'openai' ? 'openai' : 'openrouter1', 'openrouter1', 'openrouter2'];
        // Remove duplicates if the primary provider is identically in the chain.
        const uniqueChain = Array.from(new Set(chain));

        for (let i = 0; i < uniqueChain.length; i++) {
            const providerName = uniqueChain[i];
            try {
                const responseContent = await this._attemptAnalysis(providerName, dataUrl, prompt);
                return JSON.parse(responseContent);
            } catch (error) {
                const nextProvider = uniqueChain[i + 1];
                if (nextProvider) {
                    console.warn(`[AI Gateway] Timeout/Falha no provedor ${providerName}. Acionando Fallback: Provedor ${nextProvider}`);
                } else {
                    console.error(`[AI Gateway] All providers failed. Escaping.`);
                    throw new Error('Todos os provedores LLM falharam (Timeout ou Erros API).');
                }
            }
        }
    }
}

module.exports = new AiGateway();
