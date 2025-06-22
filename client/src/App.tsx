
import { useState, useEffect } from 'react';
import { FiCompass, FiInfo } from 'react-icons/fi';
import { FileUpload } from './components/FileUpload';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { CompressionResults } from './components/CompressionResults';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { StatsVisualization } from './components/StatsVisualization';
import { AlgorithmInfo } from './components/AlgorithmInfo';
import { CompressionWarning } from './components/CompressionWarning';
import { FileCompressionTip } from './components/FileCompressionTip';
import CompressionAPI from './utils/api';
import type { ApiCompressionResult } from './types/compression.types';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [algorithms, setAlgorithms] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<ApiCompressionResult | null>(null);
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  const [isSmartCompression, setIsSmartCompression] = useState(false);
  const [testedAlgorithms, setTestedAlgorithms] = useState<any[]>([]);

  // Load algorithms on component mount
  useEffect(() => {
    loadAlgorithms();
  }, []);

  const loadAlgorithms = async () => {
    try {
      const response = await CompressionAPI.getAlgorithms();
      if (response.success && response.data) {
        setAlgorithms(response.data.algorithms);
        setDescriptions(response.data.descriptions);
      } else {
        setError(response.error || 'Failed to load algorithms');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleCompress = async () => {
    if (!selectedFile || !selectedAlgorithm) {
      setError('Please select a file and algorithm');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Compressing file...');
    setError('');
    setResult(null);
    setIsSmartCompression(false);
    setTestedAlgorithms([]);

    try {
      const response = await CompressionAPI.compressFile(selectedFile, selectedAlgorithm);
      
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || 'Compression failed');
      }
    } catch (err) {
      setError('Compression failed');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSmartCompress = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Testing all algorithms to find the best compression...');
    setError('');
    setResult(null);
    setIsSmartCompression(true);
    setTestedAlgorithms([]);

    try {
      const response = await CompressionAPI.smartCompressFile(selectedFile);
      
      if (response.success && response.data) {
        setResult(response.data);
        setTestedAlgorithms(response.data.testedAlgorithms || []);
        setSelectedAlgorithm(response.data.algorithm); // Update selected algorithm to the best one
      } else {
        setError(response.error || 'Smart compression failed');
      }
    } catch (err) {
      setError('Smart compression failed');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleDecompress = async () => {
    if (!result) return;

    setIsLoading(true);
    setLoadingMessage('Testing decompression...');
    setError('');

    try {
      const response = await CompressionAPI.decompressFile(
        result.compressedData,
        result.algorithm,
        result.metadata
      );

      if (response.success) {
        setError(''); 
        alert('Decompression test successful! The compressed file can be properly restored.');
      } else {
        setError(response.error || 'Decompression test failed');
      }
    } catch (err) {
      setError('Decompression test failed');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedAlgorithm('');
    setResult(null);
    setError('');
    setIsSmartCompression(false);
    setTestedAlgorithms([]);
  };

  const canCompress = selectedFile && selectedAlgorithm && !isLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <FiCompass className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Compresso
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAlgorithmInfo(!showAlgorithmInfo)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Algorithm Information"
              >
                <FiInfo className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              File Compression Tool
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Upload any file and compress it using advanced algorithms like Huffman Coding, 
              Run-Length Encoding, or LZ77. Compare efficiency and download results.
            </p>
          </div>

          {/* Algorithm Information */}
          {showAlgorithmInfo && algorithms.length > 0 && (
            <AlgorithmInfo descriptions={descriptions} />
          )}

          {/* Error Display */}
          {error && (
            <ErrorMessage 
              message={error} 
              onDismiss={() => setError('')}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <LoadingSpinner message={loadingMessage} />
            </div>
          )}

          {/* Main Interface */}
          {!isLoading && !result && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
              {/* File Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  1. Select File
                </h3>
                <FileUpload
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                />
                {/* Compression Tip */}
                {selectedFile && (
                  <div className="mt-3">
                    <FileCompressionTip file={selectedFile} />
                  </div>
                )}
              </div>

              {/* Algorithm Selection */}
              {selectedFile && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    2. Choose Algorithm
                  </h3>
                  <AlgorithmSelector
                    algorithms={algorithms}
                    descriptions={descriptions}
                    selectedAlgorithm={selectedAlgorithm}
                    onAlgorithmChange={setSelectedAlgorithm}
                  />
                </div>
              )}

              {/* Compress Buttons */}
              {selectedFile && selectedAlgorithm && (
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                  <button
                    onClick={handleCompress}
                    disabled={!canCompress}
                    className={`
                      px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200
                      ${canCompress
                        ? 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                        : 'bg-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Compress with {selectedAlgorithm.toUpperCase()}
                  </button>
                  
                  <button
                    onClick={handleSmartCompress}
                    disabled={!selectedFile || isLoading}
                    className={`
                      px-8 py-3 rounded-lg font-semibold transition-all duration-200 border-2
                      ${selectedFile && !isLoading
                        ? 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transform hover:scale-105'
                        : 'border-gray-400 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Smart Compress (Auto-select Best)
                  </button>
                </div>
              )}

              {/* Quick Smart Compress for files without algorithm selection */}
              {selectedFile && !selectedAlgorithm && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleSmartCompress}
                    disabled={!selectedFile || isLoading}
                    className={`
                      px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200
                      ${selectedFile && !isLoading
                        ? 'bg-purple-600 hover:bg-purple-700 transform hover:scale-105'
                        : 'bg-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Smart Compress (Try All Algorithms)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-6">
              {/* Compression Warning */}
              <CompressionWarning
                result={result}
                onTrySmartCompression={!isSmartCompression ? handleSmartCompress : undefined}
                isSmartCompression={isSmartCompression}
                testedAlgorithms={testedAlgorithms}
              />
              
              <CompressionResults
                result={result}
                originalFilename={selectedFile?.name || 'file'}
                onDecompress={handleDecompress}
              />
              
              {/* Statistics Visualization */}
              <StatsVisualization
                stats={{
                  originalSize: result.originalSize,
                  processedSize: result.compressedSize,
                  compressionRatio: result.compressionRatio,
                  processingTime: result.metadata?.processingTime || 0,
                  algorithm: result.algorithm
                }}
                darkMode={false}
              />
              
              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                >
                  Compress Another File
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              Built with React, NestJS, and advanced compression algorithms
            </p>
            <p className="text-sm">
              Supports Huffman Coding, Run-Length Encoding (RLE), and LZ77 compression
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
