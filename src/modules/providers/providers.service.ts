import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProviderAdapter, UnifiedProduct } from '../../common/interfaces';
import { FakeShopAdapter } from './adapters/fakeshop.adapter';
import { DummyJsonAdapter } from './adapters/dummyjson.adapter';
import { UnifiedService } from '../unified/unified.service';

@Injectable()
export class ProvidersService {
  private readonly logger = new Logger(ProvidersService.name);
  private readonly adapters: ProviderAdapter[];

  constructor(
    private readonly fakeShop: FakeShopAdapter,
    private readonly dummyJson: DummyJsonAdapter,
    private readonly unifiedService: UnifiedService,
  ) {
    this.adapters = [this.fakeShop, this.dummyJson];
  }

  async fetchFromProvider(providerName: string): Promise<UnifiedProduct[]> {
    const adapter = this.adapters.find((a) => a.name === providerName);
    if (!adapter) throw new Error(`Provider "${providerName}" not found`);
    return adapter.fetchProducts();
  }

  async fetchAll(): Promise<{ provider: string; count: number }[]> {
    const results: { provider: string; count: number }[] = [];

    for (const adapter of this.adapters) {
      try {
        const products = await adapter.fetchProducts();
        await this.unifiedService.upsertMany(products);
        results.push({ provider: adapter.name, count: products.length });
        this.logger.log(`Fetched ${products.length} products from ${adapter.name}`);
      } catch (err: any) {
        this.logger.error(`Failed to fetch from ${adapter.name}: ${err.message}`);
        results.push({ provider: adapter.name, count: 0 });
      }
    }

    return results;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncAll() {
    this.logger.log('Starting scheduled sync...');
    await this.fetchAll();
  }

  getProviders(): string[] {
    return this.adapters.map((a) => a.name);
  }
}
