import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Code } from 'lucide-react';

const About = () => {
    return (
        <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-game-primary to-game-accent">
                    About PicPhrase
                </h1>
                <p className="text-xl text-game-muted max-w-2xl mx-auto">
                    The ultimate visual puzzle game designed to test your lateral thinking and phrase knowledge.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
                {[
                    { icon: Brain, title: "Brain Training", desc: "Sharpen your mind by connecting disparate visual cues into coherent phrases." },
                    { icon: Sparkles, title: "Visual Delight", desc: "Enjoy a premium, distraction-free environment with beautiful imagery." },
                    { icon: Code, title: "Modern Tech", desc: "Built with the latest web technologies for a smooth, app-like experience." }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-8 rounded-3xl border border-white/5 hover:border-game-primary/30 transition-colors"
                    >
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-game-primary">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-game-muted leading-relaxed">
                            {item.desc}
                        </p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden text-center"
            >
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-4">How to Play</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto mt-8">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-game-primary/20 text-game-primary flex items-center justify-center font-bold shrink-0">1</div>
                            <p className="text-game-muted">Observe the images shown in the level. Each one represents a word or concept.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-game-secondary/20 text-game-secondary flex items-center justify-center font-bold shrink-0">2</div>
                            <p className="text-game-muted">Combine the concepts to form a common idiom, phrase, or saying.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-game-accent/20 text-game-accent flex items-center justify-center font-bold shrink-0">3</div>
                            <p className="text-game-muted">Type your answer! Don't worry about punctuation or capitalization.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
