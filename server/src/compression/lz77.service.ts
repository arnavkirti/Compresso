import { Injectable } from '@nestjs/common';

interface LZ77Token {
  offset: number;
  length: number;
  literal: string;
}

@Injectable()
export class LZ77Service {
  private readonly WINDOW_SIZE = 4096;
  private readonly LOOKAHEAD_SIZE = 256;

  compress(data: Buffer): { compressed: Buffer; originalSize: number } {
    const text = data.toString('binary');
    const originalSize = data.length;
    const tokens: LZ77Token[] = [];
    
    let position = 0;
    
    while (position < text.length) {
      const match = this.findLongestMatch(text, position);
      
      if (match.length > 0) {
        const nextChar = text[position + match.length] || '';
        tokens.push({
          offset: match.offset,
          length: match.length,
          literal: nextChar
        });
        position += match.length + 1;
      } else {
        tokens.push({
          offset: 0,
          length: 0,
          literal: text[position]
        });
        position++;
      }
    }
    
    const compressed = this.tokensToBuffer(tokens);
    return { compressed, originalSize };
  }

  decompress(compressed: Buffer): Buffer {
    const tokens = this.bufferToTokens(compressed);
    let result = '';
    
    for (const token of tokens) {
      if (token.length > 0) {
        const start = result.length - token.offset;
        for (let i = 0; i < token.length; i++) {
          result += result[start + i];
        }
      }
      
      if (token.literal) {
        result += token.literal;
      }
    }
    
    return Buffer.from(result, 'binary');
  }

  private findLongestMatch(text: string, position: number): { offset: number; length: number } {
    const windowStart = Math.max(0, position - this.WINDOW_SIZE);
    const lookaheadEnd = Math.min(text.length, position + this.LOOKAHEAD_SIZE);
    
    let bestOffset = 0;
    let bestLength = 0;
    
    for (let i = windowStart; i < position; i++) {
      let length = 0;
      
      while (
        position + length < lookaheadEnd &&
        text[i + length] === text[position + length]
      ) {
        length++;
      }
      
      if (length > bestLength) {
        bestLength = length;
        bestOffset = position - i;
      }
    }
    
    return { offset: bestOffset, length: bestLength };
  }

  private tokensToBuffer(tokens: LZ77Token[]): Buffer {
    const buffer: number[] = [];
    
    for (const token of tokens) {
      // Encode offset (2 bytes)
      buffer.push((token.offset >> 8) & 0xFF);
      buffer.push(token.offset & 0xFF);
      
      // Encode length (1 byte)
      buffer.push(token.length & 0xFF);
      
      // Encode literal (1 byte)
      const charCode = token.literal.charCodeAt(0) || 0;
      buffer.push(charCode);
    }
    
    return Buffer.from(buffer);
  }

  private bufferToTokens(buffer: Buffer): LZ77Token[] {
    const tokens: LZ77Token[] = [];
    
    for (let i = 0; i < buffer.length; i += 4) {
      if (i + 3 < buffer.length) {
        const offset = (buffer[i] << 8) | buffer[i + 1];
        const length = buffer[i + 2];
        const literal = String.fromCharCode(buffer[i + 3]);
        
        tokens.push({ offset, length, literal });
      }
    }
    
    return tokens;
  }
}
