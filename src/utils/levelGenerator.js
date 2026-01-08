import { generateContent } from '../services/groq';
import { generateImageUrl } from './imageGenerator';

export const generateLevel = async (previousLevels = []) => {
    const validLevels = previousLevels.filter(l => l && l.answer);
    const avoidPhrases = validLevels.map(l => l.answer).slice(-30).join(", ");

    const categories = [
        "Simple Compound Word", "Common Phrase", "Everyday Activity",
        "Two Word Thing", "Animal Name", "Food Item"
    ];
    const targetCategory = categories[Math.floor(Math.random() * categories.length)];

    const prompt = `
    Create a JSON object for a "PicPhrase" puzzle.
    
    Target Category: ${targetCategory} (CRITICAL: Must be this category)
    Goal: The user guesses a ${targetCategory} from 2-3 images.
    
    CRITICAL Rules for Difficulty "EASY":
    - The Phrase MUST be extremely common and known by a 5-year-old.
    - The Images MUST be LITERAL representations of the words.
    - Example: "Hot Dog" -> Image of Fire (Hot) + Image of Dog.
    - Example: "Sun Flower" -> Image of Sun + Image of Flower.
    
    CRITICAL Rules for Images:
    - You must provide 2 or 3 images.
    - "keywords" MUST be 1-3 simple words describing a physical object.
    - NO sentences in "keywords".
    
    JSON Structure:
    {
      "id": "unique_string",
      "type": "Easy ${targetCategory}",
      "answer": "Target Phrase",
      "variants": ["Alternative answer"],
      "difficulty": 1,
      "hintTexts": ["Very direct hint 1"],
      "images": [
        { "keywords": "simple object 1", "alt": "short text" },
        { "keywords": "simple object 2", "alt": "short text" }
      ]
    }

    Constraints:
    - The "answer" should be short (1-3 words max).
    - Avoid phrases: ${avoidPhrases}
    - Output ONLY raw JSON. No markdown.
    `;

    try {
        const jsonText = await generateContent(prompt);

        // Clean up markdown if present
        const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
        const levelData = JSON.parse(cleanJson);

        // Process images with imageGenerator
        const processedImages = levelData.images.map(img => ({
            ...img,
            url: generateImageUrl(img.keywords || img.description) // Fallback to description if keywords missing
        }));

        return {
            ...levelData,
            images: processedImages,
            id: `ai_${Date.now()}`
        };

    } catch (error) {
        console.error("Level Generation Failed:", error);
        return null;
    }
};
