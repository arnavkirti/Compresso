import { Injectable } from '@nestjs/common';

interface HuffmanNode {
  char?: string;
  frequency: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
}

@Injectable()
export class HuffmanService {
  compress(data: Buffer): { compressed: Buffer; tree: any; originalSize: number } {
    const text = data.toString('binary');
    const originalSize = data.length;

    // Count frequencies
    const frequencies = new Map<string, number>();
    for (const char of text) {
      frequencies.set(char, (frequencies.get(char) || 0) + 1);
    }

    // Build Huffman tree
    const tree = this.buildHuffmanTree(frequencies);
    
    // Generate codes
    const codes = new Map<string, string>();
    this.generateCodes(tree, '', codes);

    // Encode text
    let encodedBits = '';
    for (const char of text) {
      encodedBits += codes.get(char) || '';
    }

    // Convert bits to bytes
    const compressed = this.bitsToBuffer(encodedBits);

    return {
      compressed,
      tree: this.serializeTree(tree),
      originalSize
    };
  }

  decompress(compressed: Buffer, tree: any): Buffer {
    const deserializedTree = this.deserializeTree(tree);
    if (!deserializedTree) {
      throw new Error('Invalid tree data');
    }
    
    const bits = this.bufferToBits(compressed);
    
    let result = '';
    let currentNode = deserializedTree;
    
    for (const bit of bits) {
      if (bit === '0' && currentNode.left) {
        currentNode = currentNode.left;
      } else if (bit === '1' && currentNode.right) {
        currentNode = currentNode.right;
      }
      
      if (currentNode.char !== undefined) {
        result += currentNode.char;
        currentNode = deserializedTree;
      }
    }

    return Buffer.from(result, 'binary');
  }

  private buildHuffmanTree(frequencies: Map<string, number>): HuffmanNode {
    const nodes: HuffmanNode[] = Array.from(frequencies.entries()).map(([char, frequency]) => ({
      char,
      frequency
    }));

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.frequency - b.frequency);
      
      const left = nodes.shift()!;
      const right = nodes.shift()!;
      
      const merged: HuffmanNode = {
        frequency: left.frequency + right.frequency,
        left,
        right
      };
      
      nodes.push(merged);
    }

    return nodes[0];
  }

  private generateCodes(node: HuffmanNode, code: string, codes: Map<string, string>): void {
    if (node.char !== undefined) {
      codes.set(node.char, code || '0');
      return;
    }

    if (node.left) {
      this.generateCodes(node.left, code + '0', codes);
    }
    if (node.right) {
      this.generateCodes(node.right, code + '1', codes);
    }
  }

  private bitsToBuffer(bits: string): Buffer {
    const bytes: number[] = [];
    for (let i = 0; i < bits.length; i += 8) {
      const byte = bits.slice(i, i + 8).padEnd(8, '0');
      bytes.push(parseInt(byte, 2));
    }
    return Buffer.from(bytes);
  }

  private bufferToBits(buffer: Buffer): string {
    return Array.from(buffer)
      .map(byte => byte.toString(2).padStart(8, '0'))
      .join('');
  }

  private serializeTree(node: HuffmanNode | undefined): any {
    if (!node) return null;
    
    return {
      char: node.char,
      frequency: node.frequency,
      left: this.serializeTree(node.left),
      right: this.serializeTree(node.right)
    };
  }

  private deserializeTree(data: any): HuffmanNode | null {
    if (!data) return null;
    
    const node: HuffmanNode = {
      frequency: data.frequency
    };
    
    if (data.char !== undefined) {
      node.char = data.char;
    }
    
    if (data.left) {
      node.left = this.deserializeTree(data.left) || undefined;
    }
    
    if (data.right) {
      node.right = this.deserializeTree(data.right) || undefined;
    }
    
    return node;
  }
}
