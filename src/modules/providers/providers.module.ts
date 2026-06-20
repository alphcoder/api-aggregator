import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { FakeShopAdapter } from './adapters/fakeshop.adapter';
import { DummyJsonAdapter } from './adapters/dummyjson.adapter';
import { UnifiedModule } from '../unified/unified.module';

@Module({
  imports: [UnifiedModule],
  controllers: [ProvidersController],
  providers: [ProvidersService, FakeShopAdapter, DummyJsonAdapter],
})
export class ProvidersModule {}
