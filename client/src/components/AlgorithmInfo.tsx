import { useState } from 'react';
import { FiBook, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface AlgorithmInfoProps {
  descriptions: { [key: string]: string };
}

export const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ descriptions }) => {
  const [expandedAlgorithm, setExpandedAlgorithm] = useState<string>('');

  const algorithmDetails = {
    huffman: {
      name: 'Huffman Coding',
      bestFor: 'Text files, source code',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      advantages: [
        'Optimal for symbol frequency-based compression',
        'Lossless compression',
        'Good compression ratio for text'
      ],
      disadvantages: [
        'Requires two passes through data',
        'Less effective on random data',
        'Tree must be stored with compressed data'
      ]
    },
    rle: {
      name: 'Run-Length Encoding',
      bestFor: 'Images with large uniform areas, simple graphics',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      advantages: [
        'Very simple to implement',
        'Fast compression and decompression',
        'Excellent for data with many repeated sequences'
      ],
      disadvantages: [
        'Poor performance on complex data',
        'Can increase file size if no repetition exists',
        'Limited compression scope'
      ]
    },
    lz77: {
      name: 'LZ77 Compression',
      bestFor: 'General purpose, mixed content',
      timeComplexity: 'O(n²) worst case, O(n) average',
      spaceComplexity: 'O(n)',
      advantages: [
        'No prior knowledge of data needed',
        'Good general-purpose algorithm',
        'Foundation for many modern algorithms (ZIP, GZIP)'
      ],
      disadvantages: [
        'Memory intensive',
        'Slower than simpler algorithms',
        'Complex implementation'
      ]
    }
  };

  const toggleExpanded = (algorithm: string) => {
    setExpandedAlgorithm(expandedAlgorithm === algorithm ? '' : algorithm);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FiBook className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Algorithm Guide
        </h3>
      </div>

      <div className="space-y-4">
        {Object.entries(algorithmDetails).map(([key, details]) => {
          const isExpanded = expandedAlgorithm === key;
          
          return (
            <div
              key={key}
              className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleExpanded(key)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {details.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Best for: {details.bestFor}
                  </p>
                </div>
                
                {isExpanded ? (
                  <FiChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <FiChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                  <div className="space-y-4">
                    {/* Description */}
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Description
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {descriptions[key]}
                      </p>
                    </div>

                    {/* Complexity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Time Complexity
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                          {details.timeComplexity}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Space Complexity
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                          {details.spaceComplexity}
                        </p>
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 dark:text-green-400 mb-2">
                          Advantages
                        </h5>
                        <ul className="space-y-1">
                          {details.advantages.map((advantage, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                              <span className="text-green-500 mr-2">+</span>
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-red-700 dark:text-red-400 mb-2">
                          Disadvantages
                        </h5>
                        <ul className="space-y-1">
                          {details.disadvantages.map((disadvantage, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                              <span className="text-red-500 mr-2">-</span>
                              {disadvantage}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
