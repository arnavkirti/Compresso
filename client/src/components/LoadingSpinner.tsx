import { FiLoader } from 'react-icons/fi';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Processing...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <FiLoader className={`${sizeClasses[size]} animate-spin text-blue-600 mb-2`} />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};
