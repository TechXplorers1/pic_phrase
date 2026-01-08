import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Zap, Home, Info } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto">
                <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-game-primary to-game-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
                            P
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white hidden md:block group-hover:text-glow transition-all">
                            PicPhrase
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-1 md:gap-2">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${isActive ? 'bg-white/10 text-white font-bold' : 'text-game-muted hover:text-white hover:bg-white/5'}`}
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden md:block">Home</span>
                        </NavLink>

                        <NavLink
                            to="/about"
                            className={({ isActive }) => `px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${isActive ? 'bg-white/10 text-white font-bold' : 'text-game-muted hover:text-white hover:bg-white/5'}`}
                        >
                            <Info className="w-4 h-4" />
                            <span className="hidden md:block">About</span>
                        </NavLink>

                        <div className="w-px h-6 bg-white/10 mx-2 hidden md:block"></div>

                        <Link
                            to="/"
                            className="bg-game-primary hover:bg-game-primaryHover text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-game-primary/20"
                        >
                            <Zap className="w-4 h-4 fill-current" />
                            Play Now
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
