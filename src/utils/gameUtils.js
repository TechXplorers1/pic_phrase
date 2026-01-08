export const normalizeString = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();
};

export const calculateLevenshteinDistance = (a, b) => {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
};

export const checkAnswer = (input, answer, variants = []) => {
    const normInput = normalizeString(input);
    const opportunities = [answer, ...variants];

    for (const target of opportunities) {
        const normTarget = normalizeString(target);
        if (normInput === normTarget) return { isCorrect: true, type: 'exact' };

        // Allow small typos (Levenshtein distance <= 2 for longer words, 0 for short)
        const distance = calculateLevenshteinDistance(normInput, normTarget);
        if (normTarget.length > 5 && distance <= 2) {
            return { isCorrect: true, type: 'fuzzy', distance };
        }
    }

    return { isCorrect: false };
};

export const calculateScore = (difficulty, hintUsed, attempts) => {
    let base = difficulty * 100;
    if (hintUsed) base -= 25;
    // Small penalty for retries? optional. keeping it simple as per spec.
    return Math.max(0, base);
};

export const getStars = (isCorrect, hintUsed) => {
    if (!isCorrect) return 0;
    if (!hintUsed) return 3;
    return 2; // 2 stars if hint used
    // User spec said "1 if correct with 2+ hints", but we only have 1 hint button. 
    // Let's stick to: 3 for no hint, 2 for hint.
};

export const getWordDiff = (input, target) => {
    // Simple word-by-word comparison for feedback
    const inputWords = normalizeString(input).split(' ');
    const targetWords = normalizeString(target).split(' ');

    return inputWords.map((word, i) => {
        if (!targetWords[i]) return { word, status: 'extra' };
        if (word === targetWords[i]) return { word, status: 'correct' };
        return { word, status: 'incorrect' };
    });
};
