import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ categories }) => {
  if (!categories || Object.keys(categories).length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data available yet</div>;
  }

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(245, 158, 11, 0.8)',  // Yellow
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(139, 92, 246, 0.8)',  // Purple
          'rgba(16, 185, 129, 0.8)',  // Green
          'rgba(236, 72, 153, 0.8)',  // Pink
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 1,
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
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563',
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
      }
    },
    cutout: '65%',
  };

  return (
    <div className="glass-card p-6 h-[350px] flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Phishing Categories</h3>
      <div className="flex-grow relative">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
