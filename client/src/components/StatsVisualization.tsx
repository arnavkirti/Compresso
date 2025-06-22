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
import { formatFileSize, formatTime } from '../utils/fileUtils';
import type { FileProcessingStats } from '../types/compression.types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface AlgorithmResult {
  algorithm: string;
  compressedSize: number;
  compressionRatio: number;
  isEffective: boolean;
  processingTime?: number;
}

interface StatsVisualizationProps {
  stats: FileProcessingStats;
  darkMode?: boolean;
  testedAlgorithms?: AlgorithmResult[];
  isSmartCompression?: boolean;
}

export const StatsVisualization: React.FC<StatsVisualizationProps> = ({ 
  stats, 
  darkMode = false,
  testedAlgorithms = [],
  isSmartCompression = false
}) => {
  const textColor = darkMode ? '#E5E7EB' : '#374151';
  const gridColor = darkMode ? '#374151' : '#E5E7EB';

  const algorithmColors = {
    huffman: { bg: '#3B82F6', border: '#2563EB' }, // Blue
    rle: { bg: '#10B981', border: '#059669' },      // Green
    lz77: { bg: '#F59E0B', border: '#D97706' }      // Orange
  };

  // Multi-algorithm comparison data
  const hasMultipleAlgorithms = testedAlgorithms.length > 1;

  // Algorithm comparison bar chart
  const algorithmComparisonData = hasMultipleAlgorithms ? {
    labels: testedAlgorithms.map(algo => algo.algorithm.toUpperCase()),
    datasets: [
      {
        label: 'Original Size',
        data: testedAlgorithms.map(() => stats.originalSize),
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 1,
      },
      {
        label: 'Compressed Size',
        data: testedAlgorithms.map(algo => algo.compressedSize),
        backgroundColor: testedAlgorithms.map(algo => 
          algorithmColors[algo.algorithm as keyof typeof algorithmColors]?.bg || '#6B7280'
        ),
        borderColor: testedAlgorithms.map(algo => 
          algorithmColors[algo.algorithm as keyof typeof algorithmColors]?.border || '#4B5563'
        ),
        borderWidth: 1,
      },
    ],
  } : null;

  // Compression ratio comparison
  const compressionRatioData = hasMultipleAlgorithms ? {
    labels: testedAlgorithms.map(algo => algo.algorithm.toUpperCase()),
    datasets: [{
      label: 'Compression Ratio (%)',
      data: testedAlgorithms.map(algo => algo.compressionRatio),
      backgroundColor: testedAlgorithms.map(algo => {
        const color = algorithmColors[algo.algorithm as keyof typeof algorithmColors];
        return algo.isEffective ? (color?.bg || '#10B981') : '#EF4444';
      }),
      borderColor: testedAlgorithms.map(algo => {
        const color = algorithmColors[algo.algorithm as keyof typeof algorithmColors];
        return algo.isEffective ? (color?.border || '#059669') : '#DC2626';
      }),
      borderWidth: 1,
    }]
  } : null;

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
        {hasMultipleAlgorithms ? 'Comprehensive Algorithm Analysis' : 'Compression Statistics'}
      </h3>

      {/* Multi-Algorithm Comparison (Smart Compression) */}
      {hasMultipleAlgorithms && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Algorithm Size Comparison */}
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                Size Comparison by Algorithm
              </h4>
              <div className="h-64">
                <Bar data={algorithmComparisonData!} options={chartOptions} />
              </div>
            </div>

            {/* Compression Ratio Comparison */}
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                Compression Effectiveness
              </h4>
              <div className="h-64">
                <Bar data={compressionRatioData!} options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      ticks: {
                        ...chartOptions.scales.y.ticks,
                        callback: (value: any) => `${value}%`
                      }
                    }
                  }
                }} />
              </div>
            </div>
          </div>

          {/* Detailed Algorithm Comparison Table */}
          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
              Detailed Algorithm Performance
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Algorithm</th>
                    <th className="text-right p-3 font-medium text-gray-900 dark:text-gray-100">Original Size</th>
                    <th className="text-right p-3 font-medium text-gray-900 dark:text-gray-100">Compressed Size</th>
                    <th className="text-right p-3 font-medium text-gray-900 dark:text-gray-100">Compression Ratio</th>
                    <th className="text-right p-3 font-medium text-gray-900 dark:text-gray-100">Processing Time</th>
                    <th className="text-center p-3 font-medium text-gray-900 dark:text-gray-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {testedAlgorithms.map((algo, index) => (
                    <tr 
                      key={index}
                      className={`border-b border-gray-100 dark:border-gray-800 ${
                        algo.algorithm === stats.algorithm 
                          ? 'bg-green-50 dark:bg-green-900/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ 
                              backgroundColor: algorithmColors[algo.algorithm as keyof typeof algorithmColors]?.bg || '#6B7280'
                            }}
                          ></div>
                          <span className="font-medium">
                            {algo.algorithm.toUpperCase()}
                            {algo.algorithm === stats.algorithm && (
                              <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-normal">
                                (Selected)
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="text-right p-3 text-gray-600 dark:text-gray-400">
                        {formatFileSize(stats.originalSize)}
                      </td>
                      <td className="text-right p-3 text-gray-600 dark:text-gray-400">
                        {formatFileSize(algo.compressedSize)}
                      </td>
                      <td className="text-right p-3">
                        <span className={`font-medium ${
                          algo.isEffective 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {algo.compressionRatio > 0 ? '-' : '+'}{Math.abs(algo.compressionRatio).toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right p-3 text-gray-600 dark:text-gray-400">
                        {algo.processingTime ? formatTime(algo.processingTime) : 'N/A'}
                      </td>
                      <td className="text-center p-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          algo.isEffective
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        }`}>
                          {algo.isEffective ? 'Effective' : 'Ineffective'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Single Algorithm Analysis */}
      {!hasMultipleAlgorithms && (
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
      )}

      {/* Enhanced Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        {hasMultipleAlgorithms ? (
          /* Multi-Algorithm Summary */
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
              Best Result Summary ({stats.algorithm.toUpperCase()})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatFileSize(stats.originalSize)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Original Size
                </p>
              </div>
              
              <div>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatFileSize(stats.processedSize)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Final Size
                </p>
              </div>
              
              <div>
                <p className={`text-xl font-bold ${
                  stats.compressionRatio > 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stats.compressionRatio > 0 ? '-' : '+'}{Math.abs(stats.compressionRatio).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Space {stats.compressionRatio > 0 ? 'Saved' : 'Increased'}
                </p>
              </div>
              
              <div>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {formatTime(stats.processingTime)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Processing Time
                </p>
              </div>
            </div>

            {/* Algorithm Effectiveness Summary */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {testedAlgorithms.filter(algo => algo.isEffective).length} / {testedAlgorithms.length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Effective Algorithms
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {Math.max(...testedAlgorithms.map(algo => algo.compressionRatio)).toFixed(1)}%
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Best Compression
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatFileSize(Math.min(...testedAlgorithms.map(algo => algo.compressedSize)))}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Smallest Result
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Single Algorithm Summary */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-2xl font-bold ${
                stats.compressionRatio > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stats.compressionRatio > 0 ? '-' : '+'}{Math.abs(stats.compressionRatio).toFixed(1)}%
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
                {formatTime(stats.processingTime)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Processing Time
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
