import React, { useEffect, useState } from 'react';

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

const StatCard = ({ title, value, iconName, hoverBorderClass, iconColorClass, valueColorClass, isStatic = false }) => (
  <div className={`bg-surface pixel-border p-6 flex flex-col items-start transition-colors group hover:${hoverBorderClass} cursor-default`}>
    <div className="w-10 h-10 bg-surface-container-high flex items-center justify-center mb-4 border-2 border-surface-container-highest group-hover:border-current transition-colors">
      <span className={`material-symbols-outlined ${iconColorClass} text-2xl select-none`}>{iconName}</span>
    </div>
    <div className="font-label-sm text-on-surface-variant mb-1 uppercase select-none">{title}</div>
    <div className={`font-headline-lg ${valueColorClass} font-bold`}>
      {isStatic ? value : <CountUp end={value || 0} />}
    </div>
  </div>
);

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <section id="telemetry" className="mb-24">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 flex items-center gap-3 select-none">
        <span className="material-symbols-outlined text-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          monitoring
        </span>
        Live Network Telemetry
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Scanned" 
          value={stats.total_scanned} 
          iconName="globe"
          hoverBorderClass="border-primary-container"
          iconColorClass="text-primary-container"
          valueColorClass="text-primary-container"
        />
        <StatCard 
          title="Phishing Blocked" 
          value={stats.phishing_detected} 
          iconName="bug_report"
          hoverBorderClass="border-glitch-red"
          iconColorClass="text-glitch-red"
          valueColorClass="text-glitch-red"
        />
        <StatCard 
          title="Malware Prevented" 
          value={stats.suspicious_websites} 
          iconName="warning"
          hoverBorderClass="border-gold-warning"
          iconColorClass="text-gold-warning"
          valueColorClass="text-gold-warning"
        />
        <StatCard 
          title="Detection Accuracy" 
          value="99.9%" 
          iconName="verified"
          hoverBorderClass="border-matrix-green"
          iconColorClass="text-matrix-green"
          valueColorClass="text-matrix-green"
          isStatic={true}
        />
      </div>
    </section>
  );
};

export default StatsCards;

