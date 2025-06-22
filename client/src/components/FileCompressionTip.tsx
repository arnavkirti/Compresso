import { FiInfo, FiAlertCircle } from 'react-icons/fi';
import { detectFileType } from '../utils/fileTypeDetector';

interface FileCompressionTipProps {
  file: File;
}

export const FileCompressionTip: React.FC<FileCompressionTipProps> = ({ file }) => {
  const fileType = detectFileType(file);
  const isSmallFile = file.size < 1024; // Less than 1KB
  const isVerySmallFile = file.size < 512; // Less than 512 bytes

  const getTipForFileType = () => {
    if (isVerySmallFile) {
      return {
        type: 'warning' as const,
        message: 'Very small files often compress poorly due to algorithm overhead. Consider smart compression.',
        icon: FiAlertCircle
      };
    }

    if (isSmallFile) {
      return {
        type: 'info' as const,
        message: 'Small files may not compress well. Smart compression will help find the best approach.',
        icon: FiInfo
      };
    }

    switch (fileType) {
      case 'text':
        return {
          type: 'info' as const,
          message: 'Text files typically compress well with Huffman coding due to character frequency patterns.',
          icon: FiInfo
        };
      case 'image':
        return {
          type: 'info' as const,
          message: 'Images may compress well with RLE if they have large uniform areas. Complex images might not compress much.',
          icon: FiInfo
        };
      case 'archive':
        return {
          type: 'warning' as const,
          message: 'Archives are already compressed and may not benefit from additional compression.',
          icon: FiAlertCircle
        };
      case 'binary':
        return {
          type: 'info' as const,
          message: 'Binary files vary in compressibility. LZ77 is often the most reliable choice.',
          icon: FiInfo
        };
      default:
        return {
          type: 'info' as const,
          message: 'Try smart compression to automatically find the best algorithm for your file.',
          icon: FiInfo
        };
    }
  };

  const tip = getTipForFileType();
  const Icon = tip.icon;

  const styleClasses = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200'
  };

  return (
    <div className={`border rounded-lg p-3 ${styleClasses[tip.type]}`}>
      <div className="flex items-start space-x-2">
        <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium mb-1">
            Compression Tip
          </p>
          <p className="text-xs">
            {tip.message}
          </p>
        </div>
      </div>
    </div>
  );
};
