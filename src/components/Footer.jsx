import React from 'react';
import { Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full py-8 mt-auto border-t border-white/5 bg-game-bg relative z-10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-bold text-xl text-white mb-1">PicPhrase</h3>
                    <p className="text-game-muted text-sm">Visual puns for sharp minds.</p>
                </div>

                <div className="flex gap-4">
                    <a href="#" className="p-2 text-game-muted hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-2 text-game-muted hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10">
                        <Twitter className="w-5 h-5" />
                    </a>
                </div>

                <div className="text-xs text-game-muted font-mono flex items-center gap-1">
                    Made with <Heart className="w-3 h-3 text-game-accent fill-game-accent animate-pulse" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
