import { useState } from 'react';
import { FiInfo, FiChevronDown } from 'react-icons/fi';

interface AlgorithmSelectorProps {
  algorithms: string[];
  descriptions: { [key: string]: string };
  selectedAlgorithm: string;
  onAlgorithmChange: (algorithm: string) => void;
  disabled?: boolean;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithms,
  descriptions,
  selectedAlgorithm,
  onAlgorithmChange,
  disabled = false
}) => {
  const [showInfo, setShowInfo] = useState<string>('');

  const algorithmDisplayNames = {
    huffman: 'Huffman Coding',
    rle: 'Run-Length Encoding (RLE)',
    lz77: 'LZ77 Compression'
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Compression Algorithm
        </label>
        
        <div className="relative">
          <select
            value={selectedAlgorithm}
            onChange={(e) => onAlgorithmChange(e.target.value)}
            disabled={disabled}
            className={`
              w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              appearance-none cursor-pointer
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <option value="">Select an algorithm</option>
            {algorithms.map((algorithm) => (
              <option key={algorithm} value={algorithm}>
                {algorithmDisplayNames[algorithm as keyof typeof algorithmDisplayNames] || algorithm.toUpperCase()}
              </option>
            ))}
          </select>
          
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Algorithm Cards */}
      <div className="grid gap-3">
        {algorithms.map((algorithm) => {
          const isSelected = selectedAlgorithm === algorithm;
          const displayName = algorithmDisplayNames[algorithm as keyof typeof algorithmDisplayNames] || algorithm.toUpperCase();
          
          return (
            <div
              key={algorithm}
              className={`
                border rounded-lg p-3 cursor-pointer transition-all duration-200
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !disabled && onAlgorithmChange(algorithm)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`
                      w-4 h-4 rounded-full border-2 transition-colors
                      ${isSelected
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {displayName}
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(showInfo === algorithm ? '' : algorithm);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  disabled={disabled}
                >
                  <FiInfo className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              {showInfo === algorithm && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {descriptions[algorithm] || 'No description available.'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
