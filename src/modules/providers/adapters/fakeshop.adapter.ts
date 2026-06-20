import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ProviderAdapter, UnifiedProduct } from '../../../common/interfaces';

@Injectable()
export class FakeShopAdapter implements ProviderAdapter {
  readonly name = 'fakeshop';
  private readonly baseUrl = 'https://fakestoreapi.com';

  async fetchProducts(): Promise<UnifiedProduct[]> {
    const { data } = await axios.get(`${this.baseUrl}/products`);
    return data.map((item: any) => this.normalize(item));
  }

  async fetchProduct(externalId: string): Promise<UnifiedProduct | null> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/products/${externalId}`);
      return this.normalize(data);
    } catch {
      return null;
    }
  }

  private normalize(raw: any): UnifiedProduct {
    return {
      externalId: String(raw.id),
      provider: this.name,
      name: raw.title,
      description: raw.description,
      price: raw.price,
      currency: 'USD',
      category: raw.category,
      imageUrl: raw.image,
      inStock: true,
      attributes: { rating: raw.rating?.rate, reviews: raw.rating?.count },
      rawData: raw,
      fetchedAt: new Date(),
    };
  }
}
