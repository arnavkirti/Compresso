import { Injectable } from '@nestjs/common';

@Injectable()
export class RLEService {
  compress(data: Buffer): { compressed: Buffer; originalSize: number } {
    const originalSize = data.length;
    const compressedData: number[] = [];
    
    let i = 0;
    while (i < data.length) {
      const currentByte = data[i];
      let count = 1;
      
      // Count consecutive identical bytes
      while (i + count < data.length && data[i + count] === currentByte && count < 255) {
        count++;
      }
      
      // Store byte and count
      compressedData.push(currentByte);
      compressedData.push(count);
      
      i += count;
    }
    
    return {
      compressed: Buffer.from(compressedData),
      originalSize
    };
  }

  decompress(compressed: Buffer): Buffer {
    const result: number[] = [];
    
    for (let i = 0; i < compressed.length; i += 2) {
      if (i + 1 < compressed.length) {
        const byte = compressed[i];
        const count = compressed[i + 1];
        
        for (let j = 0; j < count; j++) {
          result.push(byte);
        }
      }
    }
    
    return Buffer.from(result);
  }
}

// Legacy functions for backward compatibility
export function compressRLE(data: string): string {
    let result = '';
    let i = 0;

    while (i < data.length) {
        let count = 1;
        while (i + 1 < data.length && data[i] === data[i + 1]) {
            count++;
            i++;
        }
        result += data[i] + count;
        i++;
    }

    return result;
}

export function decompressRLE(data: string): string {
    let result = '';
    for (let i = 0; i < data.length; i += 2) {
        const char = data[i];
        const count = parseInt(data[i + 1], 10);
        result += char.repeat(count);
    }
    return result;
}