import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ categories }) => {
  if (!categories || Object.keys(categories).length === 0) {
    return (
      <div className="bg-surface pixel-border p-6 h-[350px] flex flex-col justify-center items-center select-none font-label-md">
        &gt; NO CATEGORY TELEMETRY DETECTED.
      </div>
    );
  }

  const data = {
    labels: Object.keys(categories).map(k => k.toUpperCase()),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          '#FF4D4D', // Glitch Red
          '#FFD000', // Gold
          '#00f5ff', // Cyber Cyan
          '#d0bcff', // Neon Purple
          '#00FF88', // Matrix Green
          '#e9feff', // Cool White
        ],
        borderColor: '#121A2B',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#dee1f9',
          font: { family: 'JetBrains Mono', size: 11 }
        }
      },
      tooltip: {
        backgroundColor: '#080d1d',
        titleColor: '#00f5ff',
        bodyColor: '#dee1f9',
        borderColor: '#2f3446',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 0,
        titleFont: { family: 'JetBrains Mono', weight: 'bold' },
        bodyFont: { family: 'JetBrains Mono' }
      }
    },
    cutout: '65%',
  };

  return (
    <div className="bg-surface pixel-border p-6 h-[350px] flex flex-col">
      <h3 className="text-lg font-bold text-primary-container mb-4 select-none flex items-center gap-2">
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>pie_chart</span>
        PHISHING CATEGORIES
      </h3>
      <div className="flex-grow relative h-60">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;

