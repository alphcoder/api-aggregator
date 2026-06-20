export interface UnifiedProduct {
  externalId: string;
  provider: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
  attributes: Record<string, any>;
  rawData: Record<string, any>;
  fetchedAt: Date;
}

export interface ProviderAdapter {
  readonly name: string;
  fetchProducts(params?: Record<string, any>): Promise<UnifiedProduct[]>;
  fetchProduct(externalId: string): Promise<UnifiedProduct | null>;
}
