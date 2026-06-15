import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ growth }) => {
  if (!growth || Object.keys(growth).length === 0) {
    return (
      <div className="bg-surface pixel-border p-6 h-[350px] flex flex-col justify-center items-center select-none font-label-md mt-6">
        &gt; NO SCAN GROWTH TELEMETRY DETECTED.
      </div>
    );
  }

  // Sort by month ascending
  const sortedMonths = Object.keys(growth).sort();

  // Calculate cumulative sum for growth
  let cumulative = 0;
  const cumulativeData = sortedMonths.map(m => {
    cumulative += growth[m];
    return cumulative;
  });

  const data = {
    labels: sortedMonths.map(m => {
      const [year, month] = m.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleString('default', { month: 'short' }).toUpperCase();
    }),
    datasets: [
      {
        fill: true,
        label: 'TOTAL SCANS',
        data: cumulativeData,
        borderColor: '#00f5ff', // Cyber Cyan
        backgroundColor: 'rgba(0, 245, 255, 0.05)',
        tension: 0.2,
        pointBackgroundColor: '#00f5ff',
        pointBorderColor: '#0e1323',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 3,
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
    <div className="bg-surface pixel-border p-6 h-[350px] flex flex-col mt-6">
      <h3 className="text-lg font-bold text-primary-container mb-4 select-none flex items-center gap-2">
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>line_axis</span>
        GLOBAL WEBSITE SCAN GROWTH
      </h3>
      <div className="flex-grow relative h-60">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;

