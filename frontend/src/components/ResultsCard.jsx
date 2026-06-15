import React from 'react';
import ReportActions from './ReportActions';

const ResultsCard = ({ result, loading, error }) => {
  if (loading) return null; // Hero handles loading state
  
  if (error) {
    return (
      <div className="bg-surface pixel-border border-glitch-red/50 p-6 mb-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center text-glitch-red font-bold font-label-md mb-2">
          <span className="material-symbols-outlined text-2xl mr-2">warning</span>
          ANALYSIS FAILURE
        </div>
        <p className="text-on-surface-variant font-mono text-sm">&gt; ERROR: {error}</p>
      </div>
    );
  }

  if (!result) return null;

  const { status, risk_score, reasons, url, category } = result;

  const statusConfig = {
    'Safe': {
      label: '[ SAFE ]',
      color: 'text-matrix-green',
      icon: 'shield',
      borderClass: 'border-matrix-green',
      bgClass: 'bg-matrix-green/10',
      progressBarClass: 'bg-matrix-green'
    },
    'Suspicious': {
      label: '[ ALERT ]',
      color: 'text-gold-warning',
      icon: 'warning',
      borderClass: 'border-gold-warning',
      bgClass: 'bg-gold-warning/10',
      progressBarClass: 'bg-gold-warning'
    },
    'Phishing': {
      label: '[ THREAT ]',
      color: 'text-glitch-red',
      icon: 'gpp_bad',
      borderClass: 'border-glitch-red',
      bgClass: 'bg-glitch-red/10',
      progressBarClass: 'bg-glitch-red'
    }
  };

  const conf = statusConfig[status] || statusConfig['Suspicious'];

  return (
    <div id="results-card" className="bg-surface pixel-border mb-12 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className={`h-2 w-full ${conf.progressBarClass}`}></div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="flex items-center space-x-6">
            <div className={`w-16 h-16 bg-surface-container-high flex items-center justify-center border-2 ${conf.borderClass} ${conf.bgClass}`}>
              <span className={`material-symbols-outlined ${conf.color} text-4xl select-none`}>{conf.icon}</span>
            </div>
            <div>
              <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1 select-none">Verdict Analysis</h2>
              <div className="flex items-center space-x-3">
                <span className={`text-3xl font-extrabold tracking-tight ${conf.color} font-headline-md`}>
                  {conf.label}
                </span>
                {category && (
                  <span className="px-3 py-1 border-2 border-surface-container-highest text-xs font-bold font-mono text-on-surface bg-surface-container-lowest">
                    {category.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center bg-surface-container-lowest p-4 border-2 border-surface-container-highest min-w-[220px] w-full md:w-auto">
            <div className="text-center w-full">
              <div className="font-label-sm text-label-sm text-on-surface-variant mb-2 select-none">Threat Score</div>
              <div className="relative pt-1 w-full">
                <div className="flex mb-2 items-center justify-between">
                  <span className={`text-xs font-bold font-mono py-0.5 px-2 border border-current ${conf.color} bg-surface-container-lowest`}>
                    {risk_score}% RISK
                  </span>
                </div>
                <div className="overflow-hidden h-3 bg-surface-container-high border border-surface-container-highest">
                  <div 
                    style={{ width: `${risk_score}%` }} 
                    className={`h-full ${conf.progressBarClass} transition-all duration-1000 ease-out`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 mb-8 border-2 border-surface-container-highest flex items-center justify-between overflow-hidden">
          <div className="truncate flex-1 pr-4">
            <span className="font-label-sm text-label-sm text-on-surface-variant mr-2 select-none">TARGET_URL:</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-container hover:underline font-mono text-sm truncate">
              {url}
            </a>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary-container transition-colors flex items-center">
            <span className="material-symbols-outlined text-lg">open_in_new</span>
          </a>
        </div>

        <div>
          <h3 className="font-headline-md text-base font-bold mb-4 text-on-surface flex items-center gap-2 select-none">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span>
            DETECTION TELEMETRY LOGS
          </h3>
          <div className="space-y-4">
            {reasons.map((r, index) => (
              <div key={index} className="flex items-start p-4 bg-surface-container border-2 border-surface-container-highest transition-transform hover:translate-x-1">
                <div className={`mt-0.5 mr-4 p-1 flex items-center justify-center border-2 ${r.score > 0 ? 'border-glitch-red bg-glitch-red/10 text-glitch-red' : 'border-matrix-green bg-matrix-green/10 text-matrix-green'}`}>
                  <span className="material-symbols-outlined text-base">
                    {r.score > 0 ? 'warning' : 'verified'}
                  </span>
                </div>
                <div>
                  <h4 className="font-label-sm text-label-sm text-on-surface font-bold">{r.detector.toUpperCase()}</h4>
                  <p className="font-mono text-xs text-on-surface-variant mt-1">{r.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t-2 border-surface-container-highest flex justify-end">
          <ReportActions result={result} />
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;

