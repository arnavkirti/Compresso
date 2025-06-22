import { FiAlertTriangle, FiInfo, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatFileSize } from '../utils/fileUtils';
import type { ApiCompressionResult } from '../types/compression.types';

interface CompressionWarningProps {
  result: ApiCompressionResult;
  onTrySmartCompression?: () => void;
  isSmartCompression?: boolean;
  testedAlgorithms?: any[];
}

export const CompressionWarning: React.FC<CompressionWarningProps> = ({
  result,
  onTrySmartCompression,
  isSmartCompression = false,
  testedAlgorithms = []
}) => {
  const isIneffective = result.compressionRatio <= 0;
  const sizeIncrease = result.metadata?.compressionIncrease || 0;
  const fallbackToOriginal = result.metadata?.fallbackToOriginal;

  if (!isIneffective && !fallbackToOriginal) {
    return null; // No warning needed
  }

  return (
    <div className="space-y-4">
      {/* Main Warning */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              {fallbackToOriginal ? 'Compression Not Beneficial' : 'Poor Compression Results'}
            </h4>
            
            {fallbackToOriginal ? (
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                The {result.algorithm.toUpperCase()} algorithm would have increased the file size by{' '}
                <span className="font-semibold">{formatFileSize(sizeIncrease)}</span>. 
                We've kept the original file instead to save space.
              </p>
            ) : (
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                The compression increased the file size by{' '}
                <span className="font-semibold">{Math.abs(result.compressionRatio).toFixed(1)}%</span>
                {' '}({formatFileSize(Math.abs(result.originalSize - result.compressedSize))}).
              </p>
            )}

            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              <p className="font-medium mb-1">Why this happened:</p>
              <ul className="space-y-1 ml-4">
                {result.algorithm === 'huffman' && (
                  <li>• File has uniform character distribution or small size relative to tree overhead</li>
                )}
                {result.algorithm === 'rle' && (
                  <li>• File lacks repetitive patterns; each byte becomes two bytes (value + count)</li>
                )}
                {result.algorithm === 'lz77' && (
                  <li>• File is too small or lacks recurring patterns for dictionary-based compression</li>
                )}
                <li>• Algorithm overhead exceeds compression benefits for this specific file</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Compression Suggestion */}
      {!isSmartCompression && onTrySmartCompression && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FiInfo className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Try Smart Compression
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Smart compression tests all available algorithms and automatically selects the best one 
                for your specific file type and content.
              </p>
              <button
                onClick={onTrySmartCompression}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Try Smart Compression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Comparison (for smart compression) */}
      {isSmartCompression && testedAlgorithms.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <FiInfo className="h-4 w-4 mr-2" />
            Algorithm Comparison Results
          </h4>
          
          <div className="space-y-2">
            {testedAlgorithms.map((algo, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded ${
                  algo.algorithm === result.algorithm
                    ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                    : 'bg-white dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">
                    {algo.algorithm.toUpperCase()}
                    {algo.algorithm === result.algorithm && (
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">(Selected)</span>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatFileSize(algo.compressedSize)}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    {algo.isEffective ? (
                      <FiTrendingDown className="h-3 w-3 text-green-500" />
                    ) : (
                      <FiTrendingUp className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        algo.isEffective ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {algo.compressionRatio > 0 ? '-' : '+'}{Math.abs(algo.compressionRatio).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
