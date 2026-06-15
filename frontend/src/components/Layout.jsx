import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThreeLock from './ThreeLock';

const Layout = ({ children, darkMode, toggleTheme }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface relative overflow-x-hidden font-body-md text-body-md">
      {/* Global Scanline Overlay */}
      <div className="fixed inset-0 scanline-bg z-50 pointer-events-none mix-blend-overlay"></div>

      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-6 md:px-margin-desktop h-20 bg-surface/95 backdrop-blur-sm border-b-4 border-surface-container-highest shadow-[0_4px_0_0_rgba(47,52,70,1)]">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary-container text-3xl select-none">shield</span>
          <span className="font-headline-md text-headline-md font-bold text-primary-container tracking-tighter select-none">
            PHISHGUARD_AI
          </span>
        </div>
        <div className="flex gap-4 md:gap-8 items-center font-label-md text-label-md">
          <Link className="hidden lg:inline text-primary-container border-b-2 border-primary-container pb-1 transition-colors hover:bg-surface-container-high" to="/how-it-works">How it Works</Link>
          <Link className="hidden sm:inline text-on-surface-variant hover:text-primary-fixed-dim transition-colors hover:bg-surface-container-high hover:text-primary-container" to="/privacy">Privacy Protocol</Link>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 border-2 border-surface-container-highest hover:border-primary-container hover:text-primary-container transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-5 w-5 text-gold-warning animate-pulse" /> : <Moon className="h-5 w-5 text-primary-container" />}
          </button>


        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-28 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-gutter px-6 md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-container-lowest border-t-4 border-surface-container-highest bg-[rgba(0,245,255,0.03)] relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative flex items-center justify-center border-2 border-surface-container-highest bg-surface-container-lowest">
            <ThreeLock />
          </div>
          <div className="font-label-md text-label-md text-matrix-green">
            © {new Date().getFullYear()} PHISHGUARD AI - SYSTEM_STATUS: OPERATIONAL
          </div>
        </div>
        <div className="flex flex-wrap gap-6 font-label-sm text-label-sm justify-center">
          <a className="text-on-surface-variant hover:text-matrix-green hover:drop-shadow-[0_0_4px_rgba(0,255,136,0.5)] transition-all cursor-pointer" href="#telemetry">Threat Database</a>
          <a className="text-on-surface-variant hover:text-matrix-green hover:drop-shadow-[0_0_4px_rgba(0,255,136,0.5)] transition-all cursor-pointer" href="#docs">API Docs</a>
          <a className="text-on-surface-variant hover:text-matrix-green hover:drop-shadow-[0_0_4px_rgba(0,255,136,0.5)] transition-all cursor-pointer" href="#privacy">Privacy Protocol</a>
          <a className="text-on-surface-variant hover:text-matrix-green hover:drop-shadow-[0_0_4px_rgba(0,255,136,0.5)] transition-all cursor-pointer" href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

