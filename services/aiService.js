const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const isMock = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('mock');

const aiService = {
    improveContent: async (content) => {
        if (isMock) return `[Improved by AI] ${content} \n\n(Please provide a real OPENAI_API_KEY in backend/.env to get actual AI responses)`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert editor. Rewrite the following text clearly, improve grammar, and make it concise." },
                { role: "user", content }
            ],
            temperature: 0.7,
        });
        return response.choices[0].message.content;
    },

    generateSummary: async (content) => {
        if (isMock) return `This is a mock summary. (Please provide a real OPENAI_API_KEY in backend/.env)`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Generate a short 2-3 line summary for the following text." },
                { role: "user", content }
            ],
            temperature: 0.5,
        });
        return response.choices[0].message.content;
    },

    suggestTags: async (content) => {
        if (isMock) return "MockTag1, MockTag2";

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Suggest 3-5 relevant comma-separated tags for the following text. Only return the tags, no other text." },
                { role: "user", content }
            ],
            temperature: 0.5,
        });
        return response.choices[0].message.content;
    }
};

module.exports = aiService;
