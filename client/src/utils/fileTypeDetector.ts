export const detectFileType = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type.toLowerCase();

  // Text files
  if (mimeType.startsWith('text/') || 
      ['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'py', 'java', 'c', 'cpp', 'h'].includes(extension)) {
    return 'text';
  }

  // Images
  if (mimeType.startsWith('image/') || 
      ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'].includes(extension)) {
    return 'image';
  }

  // Audio
  if (mimeType.startsWith('audio/') || 
      ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(extension)) {
    return 'audio';
  }

  // Video
  if (mimeType.startsWith('video/') || 
      ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
    return 'video';
  }

  // Documents
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp'].includes(extension)) {
    return 'document';
  }

  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(extension)) {
    return 'archive';
  }

  return 'binary';
};

export const getOptimalAlgorithm = (fileType: string, fileSize: number): string => {
  // For small files, RLE is fastest
  if (fileSize < 1024) {
    return 'rle';
  }

  switch (fileType) {
    case 'text':
      return 'huffman'; // Best for text files
    case 'image':
      return 'rle'; // Good for images with uniform areas
    case 'binary':
    case 'document':
      return 'lz77'; // General purpose
    case 'archive':
      return 'lz77'; // Already compressed, but LZ77 can still help
    default:
      return 'huffman'; // Default fallback
  }
};

export const getAlgorithmRecommendation = (file: File): {
  recommended: string;
  reason: string;
  alternatives: { algorithm: string; reason: string }[];
} => {
  const fileType = detectFileType(file);

  const recommendations = {
    text: {
      recommended: 'huffman',
      reason: 'Huffman coding is optimal for text files due to character frequency patterns',
      alternatives: [
        { algorithm: 'lz77', reason: 'Good for text with repetitive patterns' },
        { algorithm: 'rle', reason: 'Only effective if text has many repeated characters' }
      ]
    },
    image: {
      recommended: 'rle',
      reason: 'RLE works well for images with large uniform color areas',
      alternatives: [
        { algorithm: 'lz77', reason: 'Better for complex images with patterns' },
        { algorithm: 'huffman', reason: 'Can work for simple images' }
      ]
    },
    binary: {
      recommended: 'lz77',
      reason: 'LZ77 is the most versatile for unknown binary data',
      alternatives: [
        { algorithm: 'huffman', reason: 'Good if data has clear frequency patterns' },
        { algorithm: 'rle', reason: 'Only if data has many repeated byte sequences' }
      ]
    }
  };

  return recommendations[fileType as keyof typeof recommendations] || recommendations.binary;
};
