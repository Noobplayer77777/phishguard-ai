import React, { useEffect, useState } from 'react';
import { Globe, ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';

const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out expo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const StatCard = ({ title, value, icon, colorClass, bgClass }) => (
  <div className="glass-card p-6 flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-2xl">
    <div className={`p-4 rounded-xl ${bgClass} ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
        <CountUp end={value || 0} />
      </h3>
    </div>
  </div>
);

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatCard 
        title="Total Websites Analyzed" 
        value={stats.total_scanned} 
        icon={<Globe className="h-8 w-8" />}
        colorClass="text-blue-600 dark:text-blue-400"
        bgClass="bg-blue-100 dark:bg-blue-900/30"
      />
      <StatCard 
        title="Phishing Detected" 
        value={stats.phishing_detected} 
        icon={<ShieldAlert className="h-8 w-8" />}
        colorClass="text-red-600 dark:text-red-400"
        bgClass="bg-red-100 dark:bg-red-900/30"
      />
      <StatCard 
        title="Safe Websites" 
        value={stats.safe_websites} 
        icon={<ShieldCheck className="h-8 w-8" />}
        colorClass="text-green-600 dark:text-green-400"
        bgClass="bg-green-100 dark:bg-green-900/30"
      />
      <StatCard 
        title="Suspicious Websites" 
        value={stats.suspicious_websites} 
        icon={<AlertCircle className="h-8 w-8" />}
        colorClass="text-yellow-600 dark:text-yellow-400"
        bgClass="bg-yellow-100 dark:bg-yellow-900/30"
      />
    </div>
  );
};

export default StatsCards;
