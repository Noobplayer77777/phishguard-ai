import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ trends }) => {
  if (!trends || Object.keys(trends).length === 0) {
    return (
      <div className="bg-surface pixel-border p-6 h-[350px] flex flex-col justify-center items-center select-none font-label-md">
        &gt; NO TREND TELEMETRY DETECTED.
      </div>
    );
  }

  // Sort by month ascending
  const sortedMonths = Object.keys(trends).sort();

  const data = {
    labels: sortedMonths.map(m => {
      const [year, month] = m.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleString('default', { month: 'short' }).toUpperCase();
    }),
    datasets: [
      {
        label: 'PHISHING DETECTED',
        data: sortedMonths.map(m => trends[m]),
        backgroundColor: '#FF4D4D', // Glitch Red
        borderColor: '#FF4D4D',
        borderWidth: 2,
        borderRadius: 0, // Retro sharp corners
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#080d1d',
        titleColor: '#FF4D4D',
        bodyColor: '#dee1f9',
        borderColor: '#2f3446',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 0,
        titleFont: { family: 'JetBrains Mono', weight: 'bold' },
        bodyFont: { family: 'JetBrains Mono' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#2f3446',
        },
        ticks: {
          color: '#dee1f9',
          font: { family: 'JetBrains Mono', size: 10 },
          precision: 0
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#dee1f9',
          font: { family: 'JetBrains Mono', size: 10 }
        }
      }
    },
  };

  return (
    <div className="bg-surface pixel-border p-6 h-[350px] flex flex-col">
      <h3 className="text-lg font-bold text-primary-container mb-4 select-none flex items-center gap-2">
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
        MONTHLY DETECTION TRENDS
      </h3>
      <div className="flex-grow relative h-60">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;

