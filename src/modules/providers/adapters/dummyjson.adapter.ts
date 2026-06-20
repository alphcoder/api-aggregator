import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ProviderAdapter, UnifiedProduct } from '../../../common/interfaces';

@Injectable()
export class DummyJsonAdapter implements ProviderAdapter {
  readonly name = 'dummyjson';
  private readonly baseUrl = 'https://dummyjson.com';

  async fetchProducts(params?: Record<string, any>): Promise<UnifiedProduct[]> {
    const limit = params?.limit || 30;
    const { data } = await axios.get(`${this.baseUrl}/products?limit=${limit}`);
    return data.products.map((item: any) => this.normalize(item));
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
      imageUrl: raw.thumbnail,
      inStock: raw.stock > 0,
      attributes: {
        brand: raw.brand,
        rating: raw.rating,
        discount: raw.discountPercentage,
        stock: raw.stock,
      },
      rawData: raw,
      fetchedAt: new Date(),
    };
  }
}
