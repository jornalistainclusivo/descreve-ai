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

        return new OpenAI({
            apiKey: apiKey,
            baseURL: providerConfig.getBaseUrl()
        });
    }

    async _attemptAnalysis(providerName, dataUrl, prompt) {
        const config = this.providers[providerName];
        if (!config) throw new Error(`Provider config not found for: ${providerName}`);

        console.log(`[AI Gateway] Modoc active: Attempting analysis with ${providerName} (Model: ${config.model})`);

        try {
            const client = this._getClient(config);
            
            const response = await client.chat.completions.create({
                model: config.model,
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: { "url": dataUrl },
                            },
                        ],
                    },
                ],
                response_format: { type: "json_object" },
                max_tokens: 1000,
            }, {
                timeout: this.timeoutLimit // Strict SDK-level timeout
            });

            return response.choices[0].message.content;

        } catch (error) {
            const isTimeout = error.code === 'ETIMEDOUT' || error.type === 'timeout' || error.message?.toLowerCase().includes('timeout');
            
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
