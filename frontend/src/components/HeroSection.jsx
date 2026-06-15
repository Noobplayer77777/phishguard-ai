import React, { useState, useEffect } from 'react';
import { ShieldAlert, Loader2, Upload } from 'lucide-react';

const HeroSection = ({ onAnalyze, loading, onOpenBatchUpload }) => {
  const [url, setUrl] = useState('');
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate floating particles
    const generated = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 50 + Math.random() * 50,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(generated);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <section className="relative flex flex-col xl:flex-row items-center justify-center gap-12 py-12 mb-12">
      {/* Left side text and scanner terminal */}
      <div className="flex-1 z-10 w-full">
        <div className="inline-block px-3 py-1 mb-6 bg-surface-container border-2 border-primary-container text-primary-container font-label-sm text-label-sm uppercase tracking-widest">
          <span className="inline-block w-2 h-2 bg-matrix-green mr-2 animate-pulse"></span>
          System Status: Active
        </div>
        
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-6 leading-tight">
          Detect Phishing Sites <br />
          <span className="text-primary-container drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]">
            Before They Strike.
          </span>
        </h1>
        
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
          Deploy terminal-luxe AI threat analysis. Scan URLs instantly, analyze domain reputation, and neutralize threats with military-grade precision.
        </p>

        {/* Scan Input Terminal */}
        <div className="bg-surface pixel-border p-6 max-w-2xl relative">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-surface-container-highest pb-2">
            <span className="material-symbols-outlined text-primary-container text-sm select-none">terminal</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant select-none">scanner.exe</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative flex items-center bg-surface-container-lowest border-2 border-surface-container-highest p-3 focus-within:border-primary-container focus-within:shadow-[0_0_8px_rgba(0,245,255,0.3)] transition-all">
              <span className="text-matrix-green font-label-md mr-2 select-none">&gt;</span>
              <input
                type="url"
                id="urlInput"
                className="bg-transparent border-none outline-none text-primary-container font-label-md w-full placeholder-on-surface-variant/50 focus:ring-0 focus:outline-none"
                placeholder="Enter URL to scan..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <span className="cursor-block absolute right-3 pointer-events-none"></span>
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="arcade-btn px-8 py-3 font-label-md font-bold whitespace-nowrap flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  ANALYZING
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>radar</span>
                  SCAN URL
                </>
              )}
            </button>
          </form>

          {/* Quick buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={onOpenBatchUpload}
              className="arcade-btn-secondary px-5 py-2 font-label-sm text-label-sm flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              BULK CSV ANALYSIS
            </button>
            
            <span className="text-[10px] text-on-surface-variant/70 italic select-none">
              SECURE_SHELL v1.4
            </span>
          </div>
        </div>
      </div>

      {/* Right side mascot animation */}
      <div className="flex-1 relative z-10 flex justify-center items-center h-[350px] w-full xl:w-auto">
        <div className="relative w-72 h-72 xl:w-80 xl:h-80 flex justify-center items-center">
          {/* Mascot Image */}
          <img
            alt="PhishGuard AI Mascot"
            className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_20px_rgba(0,245,255,0.3)] animate-pulse-slow"
            src="https://lh3.googleusercontent.com/aida/AP1WRLsRvtHAaBlSgm-gXtwmk6PEjrN3FtOy3zkFoIz9s8QUmoQGMFgB5ZZoNyZYsnEQGpwr9qKLE6qMN1zCGjtqNQANKd2b8Ks2K9HshzbwJ9KO-e-1CDrKdF152MpUMV5JP2gWkgthIlfkL-v-15G-56qMZsQ5LzafOxLG6tN9Oh57VL-dyQnUKqsI4tDNu4MiSQI6qN2KHsco_fEL9vBhc1Rw2hOcDWzrJl_bOlY7VCZB8lwvEqcsjLUNNzbQ"
          />
          {/* Particle Container */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((p) => (
              <div
                key={p.id}
                className="particle"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  animation: `float ${p.duration}s ease-in ${p.delay}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

