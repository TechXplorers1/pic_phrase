import React, { useState, useEffect, useRef } from 'react';
import { checkAnswer, calculateScore } from '../utils/gameUtils';
import ResultOverlay from './ResultOverlay';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightbulb, Sparkles, Send, Loader2 } from 'lucide-react';

const Play = ({ levels, onBack, difficulty, onLevelIndexChange }) => {
    const [levelIndex, setLevelIndex] = useState(0);
    const [input, setInput] = useState('');
    const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintText, setShowHintText] = useState(false);
    const [score, setScore] = useState(0);

    const [imagesLoadedCount, setImagesLoadedCount] = useState(0);

    const currentLevel = levels[levelIndex] || {};
    const inputRef = useRef(null);

    // Derived state for image loading
    const isLoadingImages = currentLevel.images && imagesLoadedCount < currentLevel.images.length;

    // Reset loading state on level change
    useEffect(() => {
        setImagesLoadedCount(0);
    }, [currentLevel.id]);

    const handleImageLoad = () => {
        setImagesLoadedCount(prev => prev + 1);
    };

    // Reset state on level change
    useEffect(() => {
        if (!currentLevel.id) return;
        setInput('');
        setGameStatus('playing');
        setHintUsed(false);
        setShowHintText(false);
        if (inputRef.current) inputRef.current.focus();
    }, [levelIndex, currentLevel.id]);

    // Preload images for the next few levels
    useEffect(() => {
        const preloadLevelImages = (index) => {
            if (index >= levels.length) return;
            const level = levels[index];
            level.images.forEach((img) => {
                const image = new Image();
                image.src = img.url;
            });
        };

        // Preload next 2 levels
        preloadLevelImages(levelIndex + 1);
        preloadLevelImages(levelIndex + 2);
    }, [levelIndex, levels]);

    if (!currentLevel.id) return <div className="p-8 text-center text-game-muted">No levels found for this category.</div>;

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const result = checkAnswer(input, currentLevel.answer, currentLevel.variants);

        if (result.isCorrect) {
            setGameStatus('won');
            const earned = calculateScore(currentLevel.difficulty, hintUsed);
            setScore(prev => prev + earned);
        } else {
            setGameStatus('lost');
        }
    };

    const handleNext = () => {
        if (levelIndex < levels.length - 1) {
            const nextIndex = levelIndex + 1;
            setLevelIndex(nextIndex);
            if (onLevelIndexChange) {
                onLevelIndexChange(nextIndex);
            }
        } else {
            // Check if we are expecting more levels (infinite mode check could be passed as prop, 
            // but for now, if onBack is called it means we really ran out)
            onBack();
        }
    };

    const handleRetry = () => {
        setGameStatus('playing');
        setInput('');
        if (inputRef.current) inputRef.current.focus();
    };

    const handleUseHint = () => {
        if (gameStatus !== 'playing') return;
        setHintUsed(true);
        setShowHintText(true);
        setTimeout(() => setShowHintText(false), 4000);
    };

    const earnedScore = calculateScore(currentLevel.difficulty, hintUsed);

    // Difficulty Colors
    const diffColor = difficulty === 'easy' ? 'text-difficulty-easy' : difficulty === 'medium' ? 'text-difficulty-medium' : 'text-difficulty-hard';
    const diffBorder = difficulty === 'easy' ? 'border-difficulty-easy/30' : difficulty === 'medium' ? 'border-difficulty-medium/30' : 'border-difficulty-hard/30';

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-game-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-game-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <AnimatePresence>
                {/* Global Loading Overlay for Images */}
                {isLoadingImages && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-game-bg/80 backdrop-blur-md"
                    >
                        <Loader2 className="w-12 h-12 text-game-gold animate-spin mb-4" />
                        <div className="text-game-gold/80 font-bold tracking-widest text-sm animate-pulse">GENERATING VISUALS...</div>
                    </motion.div>
                )}

                {gameStatus !== 'playing' && (
                    <ResultOverlay
                        key="overlay"
                        isCorrect={gameStatus === 'won'}
                        answer={currentLevel.answer}
                        userAnswer={input}
                        score={earnedScore}
                        hintUsed={hintUsed}
                        onNext={handleNext}
                        onRetry={handleRetry}
                        isLastLevel={levelIndex === levels.length - 1}
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between z-10">
                <button onClick={onBack} className="p-2 -ml-2 text-game-muted hover:text-white transition-colors hover:scale-110 active:scale-95">
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-game-muted uppercase mb-1">
                        {currentLevel.type ? (
                            <span className="text-game-gold/80">{currentLevel.type} • </span>
                        ) : null}
                        Level {levelIndex + 1} / {levels.length}
                    </div>
                    <div className="w-32 h-1 bg-game-surface rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${difficulty === 'easy' ? 'bg-difficulty-easy' : difficulty === 'medium' ? 'bg-difficulty-medium' : 'bg-difficulty-hard'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${((levelIndex + 1) / levels.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-game-card/50 backdrop-blur px-3 py-1 rounded-full border border-white/5 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-game-gold fill-game-gold" />
                        <span className="text-sm font-bold tabular-nums">{score}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 overflow-y-auto">

                {/* Images Grid */}
                <div className="relative w-full max-w-3xl min-h-[300px] flex items-center justify-center mb-8 flex-col">
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                        {currentLevel.images.map((img, i) => (
                            <React.Fragment key={`${currentLevel.id}-${i}`}>
                                {i > 0 && (
                                    <div className="text-white/20 font-light text-4xl select-none">+</div>
                                )}
                                <div className={`relative group rounded-3xl overflow-hidden glass shadow-2xl ${diffBorder} border-2`}>
                                    <div className="w-36 h-36 md:w-56 md:h-56 bg-game-card relative">
                                        <img
                                            src={img.url}
                                            alt={img.alt}
                                            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoadingImages ? 'opacity-0' : 'opacity-100'}`}
                                            onLoad={handleImageLoad}
                                            onError={(e) => {
                                                handleImageLoad(); // Count error as loaded so we don't get stuck
                                                const currentSrc = e.target.src;
                                                const rawKeywords = img.keywords || img.description || 'mystery';
                                                const keyword = rawKeywords.split(',')[0].trim();
                                                const uniqueSeed = `${currentLevel.id}-${i}`;

                                                // Fallback Strategy
                                                if (currentSrc.includes('pollinations') && !currentSrc.includes('wsrv.nl')) {
                                                    // Stage 1 Fail -> Try Proxy
                                                    console.warn("Direct Pollinations failed. Trying Proxy...");
                                                    e.target.src = `https://wsrv.nl/?url=${encodeURIComponent(currentSrc)}&w=800&h=600&fit=cover`;

                                                } else if (currentSrc.includes('pollinations') || currentSrc.includes('wsrv.nl')) {
                                                    // Stage 2 Fail (Proxy failed) -> Try Proxied LoremFlickr (Context Aware)
                                                    console.warn("Proxy AI failed. Trying Proxied Stock Photo...");
                                                    const flickrUrl = `https://loremflickr.com/800/600/${encodeURIComponent(keyword)}?lock=${uniqueSeed}`;
                                                    e.target.src = `https://wsrv.nl/?url=${encodeURIComponent(flickrUrl)}&w=800&h=600&fit=cover`;

                                                } else if (currentSrc.includes('loremflickr')) {
                                                    // Stage 3 Fail -> Try Picsum (Random but Safe)
                                                    console.warn("Stock Photo failed. Trying Safe Random...");
                                                    e.target.src = `https://picsum.photos/seed/${uniqueSeed}/800/600`;

                                                } else {
                                                    // Stage 4 Fail -> Show Error UI
                                                    console.error("All image sources failed:", img.url);
                                                    e.target.style.display = 'none';
                                                    if (e.target.previousSibling) e.target.previousSibling.style.display = 'none';
                                                    e.target.parentElement.classList.remove('bg-game-card');
                                                    e.target.parentElement.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'bg-red-900/20', 'border', 'border-red-500/50');
                                                    e.target.parentElement.innerHTML = `
                                                        <div class="text-xs text-red-400 font-bold mb-2">FAILED</div>
                                                        <div class="text-[10px] text-red-200/50 px-2 text-center break-all">Blocked</div>
                                                    `;
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>


                </div>

                {/* Hint Text */}
                <AnimatePresence>
                    {showHintText && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-game-primary/20 border border-game-primary/30 text-game-primary px-4 py-2 rounded-xl text-sm font-medium mb-4 backdrop-blur-sm"
                        >
                            <Lightbulb className="w-4 h-4 inline-block mr-2 align-text-bottom" />
                            {currentLevel.hintTexts[0]}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Bottom Controls */}
            <div className="p-6 w-full max-w-2xl mx-auto z-20">
                <form onSubmit={handleSubmit} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-game-primary via-game-secondary to-game-accent rounded-2xl opacity-20 group-focus-within:opacity-100 blur transition duration-500"></div>
                    <div className="relative flex items-center bg-game-bg rounded-xl border border-white/10 shadow-2xl overflow-hidden">

                        <button
                            type="button"
                            onClick={handleUseHint}
                            disabled={hintUsed}
                            className={`px-4 py-4 flex items-center justify-center border-r border-white/5 hover:bg-white/5 transition-colors ${hintUsed ? 'opacity-30 cursor-not-allowed' : 'text-game-gold hover:text-yellow-300'}`}
                            title="Use Hint (-25pts)"
                        >
                            <Lightbulb className={`w-5 h-5 ${hintUsed ? 'fill-none' : 'fill-current'}`} />
                        </button>

                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type the phrase..."
                            className="flex-1 bg-transparent px-4 py-4 text-lg outline-none placeholder:text-white/20 font-medium tracking-wide"
                            autoComplete="off"
                            autoFocus
                        />

                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="px-6 py-4 bg-white/5 hover:bg-game-primary text-white transition-all disabled:opacity-0 disabled:translate-x-4"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Play;
