
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Play from './Play';
import { generateLevel } from '../utils/levelGenerator';
import { Loader2 } from 'lucide-react';

const AiPlayWrapper = () => {
    const navigate = useNavigate();
    const [levels, setLevels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Load history from local storage to avoid repetition across reloads
    const [history, setHistory] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('picphrase_seen_answers')) || [];
        } catch {
            return [];
        }
    });

    // Initial load
    useEffect(() => {
        const initGame = async () => {
            setIsLoading(true);

            // Convert history strings to level-like objects for the generator
            const historyObjs = history.map(h => ({ answer: h }));

            const level1 = await generateLevel(historyObjs);

            // Add level1 to exclusions for level2
            const level2 = await generateLevel([...historyObjs, level1]);

            if (level1 && level2) {
                setLevels([level1, level2]);
                // Save new answers to history
                const newHistory = [...history, level1.answer, level2.answer];
                setHistory(newHistory);
                localStorage.setItem('picphrase_seen_answers', JSON.stringify(newHistory));
            }
            setIsLoading(false);
        };
        // Only run if levels are empty (first load)
        if (levels.length === 0) initGame();
    }, []);

    // Generate more levels as user progresses to always have a buffer
    const handleLevelChange = useCallback(async (newIndex) => {
        setCurrentIndex(newIndex);

        // If we are close to the end (e.g., within 2 levels), generate more
        if (newIndex >= levels.length - 2) {

            // Combine persistent history with current session levels
            const historyObjs = history.map(h => ({ answer: h }));
            const allSeen = [...historyObjs, ...levels];

            // Generate in background
            generateLevel(allSeen).then(newLevel => {
                if (newLevel) {
                    setLevels(prev => {
                        const updated = [...prev, newLevel];
                        // Update persistence
                        const newHistory = [...history, ...updated.map(l => l.answer)];
                        // De-duplicate
                        const uniqueHistory = [...new Set(newHistory)];
                        setHistory(uniqueHistory);
                        localStorage.setItem('picphrase_seen_answers', JSON.stringify(uniqueHistory));
                        return updated;
                    });
                }
            });
        }
    }, [levels, history]);

    if (isLoading && levels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-game-bg text-center p-4">
                <Loader2 className="w-12 h-12 text-game-primary animate-spin mb-4" />
                <p className="text-game-muted font-medium animate-pulse mb-2">Consulting the AI Oracle...</p>
                <p className="text-xs text-game-muted/50 max-w-xs">If this takes too long, the AI might be resting (Rate Limit).</p>
            </div>
        );
    }

    if (!isLoading && levels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-game-bg">
                <div className="text-game-error mb-4">AI Connection Failed</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors text-white"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <Play
            levels={levels}
            onBack={() => navigate('/')}
            difficulty="ai"
            onLevelIndexChange={handleLevelChange}
        />
    );
};

export default AiPlayWrapper;
