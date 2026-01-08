
import Groq from "groq-sdk";

let groq = null;

const initializeGroq = () => {
    if (groq) return;

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
        console.warn("Groq API Key is missing. Please add VITE_GROQ_API_KEY to your .env file.");
        return;
    }

    groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
    });
};

export const generateContent = async (prompt) => {
    try {
        initializeGroq();
        if (!groq) {
            throw new Error("AI Setup Failed: Missing API Key");
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.9,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
};
