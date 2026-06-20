import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnifiedProductEntity } from './product.entity';
import { UnifiedProduct } from '../../common/interfaces';

@Injectable()
export class UnifiedService {
  constructor(
    @InjectRepository(UnifiedProductEntity)
    private readonly repo: Repository<UnifiedProductEntity>,
  ) {}

  async findAll(query: { page?: number; limit?: number; provider?: string; category?: string; search?: string }) {
    const { page = 1, limit = 20, provider, category, search } = query;

    const qb = this.repo.createQueryBuilder('p');

    if (provider) qb.andWhere('p.provider = :provider', { provider });
    if (category) qb.andWhere('p.category = :category', { category });
    if (search) qb.andWhere('p.name ILIKE :search', { search: `%${search}%` });

    qb.orderBy('p.updatedAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async upsertMany(products: UnifiedProduct[]) {
    for (const product of products) {
      await this.repo.upsert(
        {
          externalId: product.externalId,
          provider: product.provider,
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          category: product.category,
          imageUrl: product.imageUrl,
          inStock: product.inStock,
          attributes: product.attributes,
          rawData: product.rawData,
          fetchedAt: product.fetchedAt,
        },
        ['provider', 'externalId'],
      );
    }
  }

  async getStats() {
    return this.repo.query(`
      SELECT
        provider,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE in_stock = true) as in_stock,
        AVG(price) as avg_price,
        MAX(fetched_at) as last_sync
      FROM unified_products
      GROUP BY provider
    `);
  }
}
