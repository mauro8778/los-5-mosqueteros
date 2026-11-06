import { Module } from '@nestjs/common';
import { AiMatchService } from './ai-match.service';

@Module({
  providers: [AiMatchService],
  exports: [AiMatchService],
})
export class AiMatchModule {}
