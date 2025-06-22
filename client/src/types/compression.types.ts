export interface CompressionResult {
  compressed: ArrayBuffer;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  algorithm: string;
  metadata?: {
    processingTime?: number;
    isCompressionEffective?: boolean;
    actualCompressedSize?: number;
    compressionIncrease?: number;
    fallbackToOriginal?: boolean;
    tree?: any; // For Huffman
    [key: string]: any;
  };
}

export interface ApiCompressionResult extends Omit<CompressionResult, 'compressed'> {
  compressedData: string;
}

export interface DecompressionResult {
  decompressed: ArrayBuffer;
  algorithm: string;
}

export interface ApiDecompressionResult extends Omit<DecompressionResult, 'decompressed'> {
  decompressedData: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AlgorithmInfo {
  algorithms: string[];
  descriptions: { [key: string]: string };
}

export interface FileProcessingStats {
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  processingTime: number;
  algorithm: string;
}
