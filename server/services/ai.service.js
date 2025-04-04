const { OpenAI } = require('openai');
const Message = require('../models/message.model');

class AIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
            timeout: 5000
        });
    }

    async generateSmartReply(conversationHistory) {
        try {
            const prompt = this.buildPrompt(conversationHistory);

            const response = await this.openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You're a WhatsApp business assistant. Provide concise, professional replies in the same language as the customer."
                    },
                    ...conversationHistory.map(msg => ({
                        role: msg.direction === 'incoming' ? 'user' : 'assistant',
                        content: msg.content
                    }))
                ],
                temperature: 0.7,
                max_tokens: 150
            });

            return {
                text: response.choices[0].message.content,
                confidence: response.choices[0].finish_reason === 'stop' ? 0.9 : 0.6
            };
        } catch (error) {
            console.error('AI Service Error:', error);
            return null;
        }
    }
}

module.exports = new AIService();