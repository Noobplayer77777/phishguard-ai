import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import ResultsCard from '../components/ResultsCard';
import StatsCards from '../components/StatsCards';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import RecentFeed from '../components/RecentFeed';
import BatchUploadModal from '../components/BatchUploadModal';
import { useAnalyze } from '../hooks/useAnalyze';
import { useStats } from '../hooks/useStats';

const Dashboard = () => {
  const { analyze, loading: analyzeLoading, error: analyzeError, result } = useAnalyze();
  const { stats, recentScans, refreshStats } = useStats();
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const handleAnalyze = async (url) => {
    await analyze(url);
    // Refresh stats after a new scan
    refreshStats();
  };

  // Scroll to results when they arrive
  useEffect(() => {
    if (result) {
      setTimeout(() => {
        document.getElementById('results-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [result]);

  return (
    <div className="pb-12">
      <HeroSection 
        onAnalyze={handleAnalyze} 
        loading={analyzeLoading} 
        onOpenBatchUpload={() => setIsBatchModalOpen(true)} 
      />
      
      {(result || analyzeError) && (
        <ResultsCard result={result} loading={analyzeLoading} error={analyzeError} />
      )}
      
      <div className="mt-16">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 flex flex-wrap items-center gap-3 select-none">
          <span className="material-symbols-outlined text-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          PLATFORM ANALYTICS
          <span className="border-2 border-primary-container bg-primary-container/10 px-2 py-0.5 text-xs font-bold text-primary-container uppercase font-mono tracking-widest">
            LIVE GLOBAL DATA
          </span>
        </h2>
        
        <StatsCards stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <PieChart categories={stats?.categories} />
          <BarChart trends={stats?.monthly_trends} />
        </div>
        
        <LineChart growth={stats?.scan_growth} />
        
        <RecentFeed scans={recentScans} />
      </div>

      <BatchUploadModal 
        isOpen={isBatchModalOpen} 
        onClose={() => setIsBatchModalOpen(false)} 
        onUploadComplete={refreshStats} 
      />
    </div>
  );
};

export default Dashboard;

