import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Info, Download, Copy, ExternalLink, ChevronRight } from 'lucide-react';
import ReportActions from './ReportActions';

const ResultsCard = ({ result, loading, error }) => {
  if (loading) return null; // Hero section handles loading state
  
  if (error) {
    return (
      <div className="glass-card p-6 border-red-500/50 bg-red-50 dark:bg-red-900/10 mb-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center text-red-600 dark:text-red-400">
          <AlertTriangle className="h-6 w-6 mr-3" />
          <h3 className="text-lg font-semibold">Analysis Failed</h3>
        </div>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{error}</p>
      </div>
    );
  }

  if (!result) return null;

  const { status, risk_score, reasons, url, category } = result;

  const statusConfig = {
    'Safe': {
      icon: <ShieldCheck className="h-12 w-12 text-cyber-green" />,
      color: 'text-cyber-green',
      bg: 'bg-cyber-green/10',
      border: 'border-cyber-green/30',
      progress: 'bg-cyber-green'
    },
    'Suspicious': {
      icon: <Info className="h-12 w-12 text-cyber-yellow" />,
      color: 'text-cyber-yellow',
      bg: 'bg-cyber-yellow/10',
      border: 'border-cyber-yellow/30',
      progress: 'bg-cyber-yellow'
    },
    'Phishing': {
      icon: <ShieldAlert className="h-12 w-12 text-cyber-red" />,
      color: 'text-cyber-red',
      bg: 'bg-cyber-red/10',
      border: 'border-cyber-red/30',
      progress: 'bg-cyber-red'
    }
  };

  const conf = statusConfig[status] || statusConfig['Suspicious'];

  return (
    <div id="results-card" className="glass-card mb-12 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className={`h-2 w-full ${conf.progress}`}></div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div className="flex items-center space-x-6">
            <div className={`p-4 rounded-2xl ${conf.bg} ${conf.border} border shadow-inner`}>
              {conf.icon}
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Analysis Result</h2>
              <div className="flex items-center space-x-3">
                <span className={`text-3xl md:text-4xl font-bold ${conf.color}`}>
                  {status}
                </span>
                {category && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-cyber-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-cyber-600">
                    {category}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center bg-gray-50 dark:bg-cyber-900 rounded-2xl p-4 border border-gray-200 dark:border-cyber-700 min-w-[200px]">
            <div className="text-center w-full">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Risk Score</div>
              <div className="relative pt-1 w-full">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${conf.bg} ${conf.color}`}>
                      {risk_score}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-cyber-800">
                  <div 
                    style={{ width: `${risk_score}%` }} 
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${conf.progress} transition-all duration-1000 ease-out`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-cyber-900/50 rounded-xl p-4 mb-8 border border-gray-200 dark:border-cyber-800 flex items-center justify-between overflow-hidden">
          <div className="truncate flex-1 pr-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Target URL:</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyber-blue hover:underline font-mono text-sm truncate">
              {url}
            </a>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyber-blue transition-colors">
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
            Detection Reasons
          </h3>
          <div className="space-y-3">
            {reasons.map((r, index) => (
              <div key={index} className="flex items-start p-4 rounded-xl bg-white dark:bg-cyber-800 border border-gray-100 dark:border-cyber-700 shadow-sm transition-transform hover:translate-x-1">
                <div className={`mt-0.5 mr-4 p-1 rounded-full ${r.score > 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
                  {r.score > 0 ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{r.detector}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{r.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-cyber-800 flex justify-end">
          <ReportActions result={result} />
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
