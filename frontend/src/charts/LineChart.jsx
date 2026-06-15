import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ growth }) => {
  if (!growth || Object.keys(growth).length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-500">No data available yet</div>;
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
      return date.toLocaleString('default', { month: 'short' });
    }),
    datasets: [
      {
        fill: true,
        label: 'Total Scans',
        data: cumulativeData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
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
    <div className="glass-card p-6 h-[350px] flex flex-col mt-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Website Scan Growth</h3>
      <div className="flex-grow relative">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
