import { FiDownload, FiBarChart, FiClock, FiArchive } from 'react-icons/fi';
import { formatFileSize, formatTime, downloadFile } from '../utils/fileUtils';
import type { ApiCompressionResult } from '../types/compression.types';

interface CompressionResultsProps {
  result: ApiCompressionResult;
  originalFilename: string;
  onDecompress?: () => void;
}

export const CompressionResults: React.FC<CompressionResultsProps> = ({
  result,
  originalFilename,
  onDecompress
}) => {
  const handleDownload = () => {
    try {
      const extension = result.algorithm.toLowerCase();
      const filename = `${originalFilename}.${extension}`;
      downloadFile(result.compressedData, filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    }
  };

  const getRatioColor = (ratio: number) => {
    if (ratio > 50) return 'text-green-600 dark:text-green-400';
    if (ratio > 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRatioIcon = (ratio: number) => {
    if (ratio > 0) return '↓';
    return '↑';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Compression Results
        </h3>
        
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
          {result.algorithm.toUpperCase()}
        </span>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FiBarChart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Original Size
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatFileSize(result.originalSize)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FiArchive className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Compressed Size
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatFileSize(result.compressedSize)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Compression Ratio
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <p className={`text-lg font-semibold ${getRatioColor(result.compressionRatio)}`}>
              {result.compressionRatio >= 0 ? '+' : ''}{result.compressionRatio.toFixed(1)}%
            </p>
            <span className={`text-sm ${getRatioColor(result.compressionRatio)}`}>
              {getRatioIcon(result.compressionRatio)}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FiClock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Processing Time
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatTime(result.metadata?.processingTime || 0)}
          </p>
        </div>
      </div>

      {/* Compression Efficiency Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Compression Efficiency
          </span>
          <span className={`text-sm font-medium ${getRatioColor(result.compressionRatio)}`}>
            {result.compressionRatio > 0 ? 'Good' : result.compressionRatio < -20 ? 'Poor' : 'Fair'}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              result.compressionRatio > 0 
                ? 'bg-green-500' 
                : result.compressionRatio > -20 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
            }`}
            style={{
              width: `${Math.min(Math.max(result.compressionRatio + 100, 0), 100)}%`
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <FiDownload className="h-4 w-4" />
          <span>Download Compressed File</span>
        </button>
        
        {onDecompress && (
          <button
            onClick={onDecompress}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
          >
            <FiDownload className="h-4 w-4" />
            <span>Download Decompressed File</span>
          </button>
        )}
      </div>
    </div>
  );
};
