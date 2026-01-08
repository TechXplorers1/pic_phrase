import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-game-bg text-game-text font-sans relative overflow-x-hidden selection:bg-game-primary selection:text-white">
            {/* fixed background gradient meshes could go here if global */}
            <Navbar />
            <main className="flex-1 flex flex-col pt-24 min-h-screen relative z-0">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
