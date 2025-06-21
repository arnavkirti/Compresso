import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadController } from './file/upload.controller';
import { CompressionService } from './compression/compression.service';
import { HuffmanService } from './compression/huffman.service';
import { RLEService } from './compression/rle.service';
import { LZ77Service } from './compression/lz77.service';

@Module({
  imports: [],
  controllers: [AppController, UploadController],
  providers: [
    AppService,
    CompressionService,
    HuffmanService,
    RLEService,
    LZ77Service,
  ],
})
export class AppModule {}
