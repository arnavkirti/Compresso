import axios from 'axios';
import type {
  ApiResponse,
  ApiCompressionResult,
  ApiDecompressionResult,
  AlgorithmInfo
} from '../types/compression.types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
});

export class CompressionAPI {
  static async compressFile(file: File, algorithm: string): Promise<ApiResponse<ApiCompressionResult>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('algorithm', algorithm);

      const response = await api.post('/files/compress', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Compression error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Compression failed',
      };
    }
  }

  static async decompressFile(
    compressedData: string,
    algorithm: string,
    metadata?: any
  ): Promise<ApiResponse<ApiDecompressionResult>> {
    try {
      const response = await api.post('/files/decompress', {
        compressedData,
        algorithm,
        metadata,
      });

      return response.data;
    } catch (error) {
      console.error('Decompression error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Decompression failed',
      };
    }
  }

  static async getAlgorithms(): Promise<ApiResponse<AlgorithmInfo>> {
    try {
      const response = await api.get('/files/algorithms');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Failed to fetch algorithms:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch algorithms',
      };
    }
  }

  static generateDownloadUrl(type: 'compressed' | 'decompressed', filename: string, data: string): string {
    const params = new URLSearchParams({ data });
    return `${API_BASE_URL}/files/download/${type}/${encodeURIComponent(filename)}?${params.toString()}`;
  }
}

export default CompressionAPI;
