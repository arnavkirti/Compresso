import { useState, useCallback } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { validateFile, formatFileSize } from '../utils/fileUtils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragActive(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const validation = validateFile(file);
      
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }
      
      onFileSelect(file);
    }
  }, [disabled, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      const validation = validateFile(file);
      
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }
      
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const removeFile = useCallback(() => {
    setError('');
    onFileSelect(null as any);
  }, [onFileSelect]);

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${dragActive 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !disabled && document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileInput}
            disabled={disabled}
          />
          
          <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {dragActive ? 'Drop your file here' : 'Upload a file to compress'}
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag and drop or click to browse • Max 50MB
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiFile className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            {!disabled && (
              <button
                onClick={removeFile}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <FiX className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
