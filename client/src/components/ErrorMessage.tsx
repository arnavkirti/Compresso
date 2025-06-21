import { FiAlertCircle, FiX } from 'react-icons/fi';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onDismiss,
  variant = 'error'
}) => {
  const variantStyles = {
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
  };

  return (
    <div className={`border rounded-lg p-4 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
