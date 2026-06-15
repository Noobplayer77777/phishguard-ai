import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ trends }) => {
  if (!trends || Object.keys(trends).length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data available yet</div>;
  }

  // Sort by month ascending
  const sortedMonths = Object.keys(trends).sort();

  const data = {
    labels: sortedMonths.map(m => {
      const [year, month] = m.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleString('default', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Phishing Websites Detected',
        data: sortedMonths.map(m => trends[m]),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 6,
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
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
          precision: 0
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        }
      }
    },
  };

  return (
    <div className="glass-card p-6 h-[350px] flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Monthly Detection Trends</h3>
      <div className="flex-grow relative">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
