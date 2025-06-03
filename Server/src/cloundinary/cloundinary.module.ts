import { Module } from '@nestjs/common';
import { CloundinaryService } from './cloundinary.service';

@Module({
  providers: [CloundinaryService],
  exports: [CloundinaryService],
})
export class CloundinaryModule {}
