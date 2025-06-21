import { Injectable } from '@nestjs/common';
import { HuffmanService } from './huffman.service';
import { RLEService } from './rle.service';
import { LZ77Service } from './lz77.service';

export interface CompressionResult {
  compressed: Buffer;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  algorithm: string;
  metadata?: any;
}

export interface DecompressionResult {
  decompressed: Buffer;
  algorithm: string;
}

@Injectable()
export class CompressionService {
  constructor(
    private readonly huffmanService: HuffmanService,
    private readonly rleService: RLEService,
    private readonly lz77Service: LZ77Service,
  ) {}

  async compress(data: Buffer, algorithm: string): Promise<CompressionResult> {
    const startTime = Date.now();
    let result: any;
    let metadata: any = {};

    switch (algorithm.toLowerCase()) {
      case 'huffman':
        result = this.huffmanService.compress(data);
        metadata = { tree: result.tree };
        break;
      case 'rle':
        result = this.rleService.compress(data);
        break;
      case 'lz77':
        result = this.lz77Service.compress(data);
        break;
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    const processingTime = Date.now() - startTime;
    const compressionRatio = result.originalSize > 0 ? 
      (1 - result.compressed.length / result.originalSize) * 100 : 0;

    return {
      compressed: result.compressed,
      originalSize: result.originalSize,
      compressedSize: result.compressed.length,
      compressionRatio: Math.round(compressionRatio * 100) / 100,
      algorithm,
      metadata: {
        ...metadata,
        processingTime
      }
    };
  }

  async decompress(data: Buffer, algorithm: string, metadata?: any): Promise<DecompressionResult> {
    let decompressed: Buffer;

    switch (algorithm.toLowerCase()) {
      case 'huffman':
        if (!metadata?.tree) {
          throw new Error('Huffman decompression requires tree metadata');
        }
        decompressed = this.huffmanService.decompress(data, metadata.tree);
        break;
      case 'rle':
        decompressed = this.rleService.decompress(data);
        break;
      case 'lz77':
        decompressed = this.lz77Service.decompress(data);
        break;
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    return {
      decompressed,
      algorithm
    };
  }

  getSupportedAlgorithms(): string[] {
    return ['huffman', 'rle', 'lz77'];
  }

  getAlgorithmDescription(algorithm: string): string {
    const descriptions = {
      huffman: 'Huffman Coding: A lossless compression algorithm that uses variable-length codes for different characters based on their frequency. More frequent characters get shorter codes.',
      rle: 'Run-Length Encoding: A simple compression method that replaces sequences of identical data elements with a count and the element value.',
      lz77: 'LZ77: A dictionary-based compression algorithm that replaces repeated occurrences of data with references to earlier occurrences in the data stream.'
    };

    return descriptions[algorithm.toLowerCase()] || 'Algorithm description not available.';
  }
}
