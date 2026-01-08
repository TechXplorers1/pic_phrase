/**
 * Generates a safe and optimized URL for Pollinations.ai
 * @param {string} description - The description or keywords for the image
 * @returns {string} The fully constructed image URL
 */
export const generateImageUrl = (description) => {
    if (!description) return '';

    // 1. Clean the description: Keep it simple
    let cleanPrompt = description ? description.trim() : 'abstract puzzle';
    if (cleanPrompt.length === 0) cleanPrompt = 'colorful pattern';

    // 2. Add a random seed to bust cache
    const seed = Math.floor(Math.random() * 10000);

    // 3. Construct URL
    // Bare minimum URL to test connectivity
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?nologo=true`;
};
