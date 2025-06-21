import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CompressionService, CompressionResult, DecompressionResult } from '../compression/compression.service';
import * as multer from 'multer';

interface CompressRequestDto {
  algorithm: string;
}

interface DecompressRequestDto {
  algorithm: string;
  metadata?: any;
}

@Controller('api/files')
export class UploadController {
  constructor(private readonly compressionService: CompressionService) {}

  @Post('compress')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
      },
    }),
  )
  async compressFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CompressRequestDto,
  ): Promise<{
    success: boolean;
    data?: CompressionResult & { compressedData: string };
    error?: string;
  }> {
    try {
      if (!file) {
        throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
      }

      if (!body.algorithm) {
        throw new HttpException('Algorithm not specified', HttpStatus.BAD_REQUEST);
      }

      const result = await this.compressionService.compress(file.buffer, body.algorithm);

      return {
        success: true,
        data: {
          ...result,
          compressedData: result.compressed.toString('base64'),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('decompress')
  async decompressFile(
    @Body() body: DecompressRequestDto & { compressedData: string },
  ): Promise<{
    success: boolean;
    data?: { decompressedData: string; algorithm: string };
    error?: string;
  }> {
    try {
      if (!body.compressedData) {
        throw new HttpException('No compressed data provided', HttpStatus.BAD_REQUEST);
      }

      if (!body.algorithm) {
        throw new HttpException('Algorithm not specified', HttpStatus.BAD_REQUEST);
      }

      const compressedBuffer = Buffer.from(body.compressedData, 'base64');
      const result = await this.compressionService.decompress(
        compressedBuffer,
        body.algorithm,
        body.metadata,
      );

      return {
        success: true,
        data: {
          decompressedData: result.decompressed.toString('base64'),
          algorithm: result.algorithm,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('download/:type/:filename')
  async downloadFile(
    @Param('type') type: string,
    @Param('filename') filename: string,
    @Query('data') data: string,
    @Res() res: Response,
  ) {
    try {
      if (!data) {
        throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
      }

      const buffer = Buffer.from(data, 'base64');
      const extension = type === 'compressed' ? '.compressed' : '';
      
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}${extension}"`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException('Download failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('algorithms')
  getAlgorithms(): {
    algorithms: string[];
    descriptions: { [key: string]: string };
  } {
    const algorithms = this.compressionService.getSupportedAlgorithms();
    const descriptions = {};
    
    algorithms.forEach(algo => {
      descriptions[algo] = this.compressionService.getAlgorithmDescription(algo);
    });

    return {
      algorithms,
      descriptions,
    };
  }
}
