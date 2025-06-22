import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { formatFileSize } from '../utils/fileUtils';
import type { FileProcessingStats } from '../types/compression.types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface StatsVisualizationProps {
  stats: FileProcessingStats;
  darkMode?: boolean;
}

export const StatsVisualization: React.FC<StatsVisualizationProps> = ({ 
  stats, 
  darkMode = false 
}) => {
  const textColor = darkMode ? '#E5E7EB' : '#374151';
  const gridColor = darkMode ? '#374151' : '#E5E7EB';

  // Doughnut chart for size comparison
  const sizeComparisonData = {
    labels: ['Original Size', 'Compressed Size'],
    datasets: [
      {
        data: [stats.originalSize, stats.processedSize],
        backgroundColor: [
          '#EF4444', // Red for original
          '#10B981', // Green for compressed
        ],
        borderColor: [
          '#DC2626',
          '#059669',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Bar chart for compression comparison
  const compressionData = {
    labels: ['File Size Comparison'],
    datasets: [
      {
        label: 'Original Size (bytes)',
        data: [stats.originalSize],
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 1,
      },
      {
        label: 'Compressed Size (bytes)',
        data: [stats.processedSize],
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed || context.raw;
            return `${context.label}: ${formatFileSize(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: textColor,
          callback: (value: any) => formatFileSize(value),
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = ((value / (stats.originalSize + stats.processedSize)) * 100).toFixed(1);
            return `${context.label}: ${formatFileSize(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Compression Statistics
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Size Comparison Doughnut Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
            Size Distribution
          </h4>
          <div className="h-64">
            <Doughnut data={sizeComparisonData} options={doughnutOptions} />
          </div>
        </div>

        {/* Compression Bar Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
            Before vs After
          </h4>
          <div className="h-64">
            <Bar data={compressionData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.compressionRatio.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Space {stats.compressionRatio > 0 ? 'Saved' : 'Increased'}
            </p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatFileSize(Math.abs(stats.originalSize - stats.processedSize))}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Size Difference
            </p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.processingTime}ms
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Processing Time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
