import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, RefreshCw, ArrowRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getStars, normalizeString } from '../utils/gameUtils';

const ResultOverlay = ({ isCorrect, answer, userAnswer, score, hintUsed, onNext, onRetry, isLastLevel }) => {

    useEffect(() => {
        if (isCorrect) {
            // Simple burst from center
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#ec4899', '#06b6d4']
            });
        }
    }, [isCorrect]);

    const stars = getStars(isCorrect, hintUsed);

    const renderUserFeedback = () => {
        const userWords = normalizeString(userAnswer).split(' ');
        const answerWords = normalizeString(answer).split(' ');

        return (
            <div className="flex flex-wrap justify-center gap-2 my-4">
                {userWords.map((word, idx) => {
                    let colorClass = 'text-game-error line-through opacity-50';
                    if (answerWords.includes(word)) { // Simple check
                        colorClass = 'text-game-muted'; // Neutral for partial
                        if (answerWords[idx] === word) {
                            colorClass = 'text-game-success font-bold text-glow';
                        } else {
                            colorClass = 'text-game-gold';
                        }
                    }
                    return (
                        <span key={idx} className={colorClass}>{word}</span>
                    );
                })}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-game-bg/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`relative w-full max-w-sm rounded-[2rem] p-8 text-center overflow-hidden border border-white/10 shadow-2xl ${isCorrect ? 'bg-game-card' : 'bg-game-card'}`}
            >
                {/* Glow Effect */}
                <div className={`absolute -top-20 -left-20 w-60 h-60 rounded-full blur-[80px] opacity-20 ${isCorrect ? 'bg-game-success' : 'bg-game-error'}`} />

                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${isCorrect ? 'bg-gradient-to-tr from-game-success to-emerald-300 text-white' : 'bg-gradient-to-tr from-game-error to-rose-400 text-white'}`}
                    >
                        {isCorrect ? <Check className="w-12 h-12 stroke-[3]" /> : <X className="w-12 h-12 stroke-[3]" />}
                    </motion.div>

                    <h2 className={`text-4xl font-black mb-2 tracking-tight ${isCorrect ? 'text-white' : 'text-game-muted'}`}>
                        {isCorrect ? 'Awesome!' : 'Oops!'}
                    </h2>

                    {isCorrect ? (
                        <div className="space-y-4">
                            <div className="flex justify-center gap-1 mb-6">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                    >
                                        <Star
                                            className={`w-8 h-8 ${i < stars ? 'fill-game-gold text-game-gold drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-game-surface fill-game-surface'}`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 inline-block">
                                <span className="text-sm text-game-muted uppercase tracking-wider mr-2">Score +</span>
                                <span className="text-xl font-bold text-game-gold">{score}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-game-muted uppercase tracking-wider mb-1">Answer</p>
                                <p className="text-xl font-bold text-white">{answer}</p>
                            </div>
                            <div className="text-sm">
                                {renderUserFeedback()}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex gap-3">
                        {!isCorrect && (
                            <button
                                onClick={onRetry}
                                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" /> Retry
                            </button>
                        )}
                        {isCorrect && (
                            <button
                                onClick={onNext}
                                className="flex-1 py-4 bg-game-primary hover:bg-game-primaryHover text-white rounded-xl font-bold shadow-lg shadow-game-primary/30 transition-all flex items-center justify-center gap-2 group"
                            >
                                {isLastLevel ? 'Finish' : 'Next Level'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ResultOverlay;
