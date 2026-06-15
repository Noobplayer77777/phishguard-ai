import React, { useState } from 'react';
import { Search, ShieldAlert, Loader2, Upload } from 'lucide-react';

const HeroSection = ({ onAnalyze, loading, onOpenBatchUpload }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-cyber-900 mb-12 shadow-2xl border border-cyber-800">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyber-blue opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-600 opacity-20 rounded-full blur-3xl transform translate-x-1/2"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
      </div>

      <div className="relative z-10 px-6 py-16 md:py-24 sm:px-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyber-800/50 border border-cyber-700 text-cyber-blue text-sm font-medium mb-8 backdrop-blur-sm">
          <ShieldAlert className="h-4 w-4 mr-2" />
          Advanced AI Threat Intelligence
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
          PhishGuard <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-purple-500">AI</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          AI-Powered Phishing Website Detection Platform. Enter a URL below to analyze it for malicious patterns, credential theft, and brand impersonation.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <div className="relative flex items-center shadow-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="url"
              className="block w-full pl-12 pr-32 py-5 bg-white/10 border-2 border-cyber-700 text-white rounded-2xl focus:ring-0 focus:border-cyber-blue placeholder-gray-400 backdrop-blur-md transition-all text-lg"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className={`flex items-center px-6 py-3 bg-cyber-blue hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze URL'
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 font-medium">
            By analyzing, you agree to our terms of service. Do not submit sensitive personal information.
          </p>
        </form>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="button"
            onClick={onOpenBatchUpload}
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-cyber-700 text-white text-sm font-medium transition-all backdrop-blur-md shadow-lg"
          >
            <Upload className="h-4 w-4 mr-2 text-cyber-blue" />
            Bulk CSV Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
