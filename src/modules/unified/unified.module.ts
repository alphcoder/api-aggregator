import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnifiedProductEntity } from './product.entity';
import { UnifiedController } from './unified.controller';
import { UnifiedService } from './unified.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnifiedProductEntity])],
  controllers: [UnifiedController],
  providers: [UnifiedService],
  exports: [UnifiedService],
})
export class UnifiedModule {}
