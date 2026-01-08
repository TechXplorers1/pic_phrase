import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Trophy, Play, Sparkles } from 'lucide-react';

const Landing = ({ onPlay }) => {
    const difficulties = [
        {
            id: 'easy',
            label: 'Casual',
            icon: Zap,
            color: 'text-difficulty-easy',
            bg: 'bg-difficulty-easy/10',
            border: 'hover:border-difficulty-easy',
            desc: 'Quick & Fun'
        },
        {
            id: 'medium',
            label: 'Thinker',
            icon: Brain,
            color: 'text-difficulty-medium',
            bg: 'bg-difficulty-medium/10',
            border: 'hover:border-difficulty-medium',
            desc: 'Everyday Idioms'
        },
        {
            id: 'hard',
            label: 'Genius',
            icon: Trophy,
            color: 'text-difficulty-hard',
            bg: 'bg-difficulty-hard/10',
            border: 'hover:border-difficulty-hard',
            desc: 'Brain Twisters'
        },
        {
            id: 'infinite',
            label: 'Infinite',
            icon: Sparkles, // Make sure to import Sparkles
            color: 'text-game-gold',
            bg: 'bg-game-gold/10',
            border: 'hover:border-game-gold',
            desc: 'AI Generated'
        }
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-game-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-game-secondary/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 text-center mb-12"
            >
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-game-primary via-game-secondary to-game-accent animate-shine bg-[length:200%_auto]">
                        PICPHRASE
                    </span>
                </h1>
                <p className="text-game-muted text-lg md:text-xl max-w-md mx-auto">
                    Decode the phrase from the images. <br /> How fast can your mind connect the dots?
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl z-10 px-4">
                {difficulties.map((diff, i) => (
                    <motion.button
                        key={diff.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPlay(diff.id)}
                        className={`group relative glass p-8 rounded-3xl flex flex-col items-center justify-between gap-6 border border-white/5 ${diff.border} transition-all duration-300 min-h-[240px]`}
                    >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-white/5 to-transparent rounded-3xl`}></div>

                        <div className={`p-4 rounded-2xl ${diff.bg} ${diff.color} group-hover:scale-110 transition-transform duration-300`}>
                            <diff.icon size={40} className="stroke-[1.5]" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-glow transition-all">{diff.label}</h3>
                            <p className="text-sm text-game-muted font-medium uppercase tracking-wider">{diff.desc}</p>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 text-white/50">
                            <Play size={20} className="fill-current" />
                        </div>
                    </motion.button>
                ))}
            </div>

            <footer className="absolute bottom-6 text-game-surface/50 text-xs font-mono">
                v2.0 • Premium Edition
            </footer>
        </div>
    );
};

export default Landing;
