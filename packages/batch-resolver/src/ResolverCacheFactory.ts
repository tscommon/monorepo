import type { ResolverCache } from './ResolverCache';

export interface ResolverCacheFactory<Payload, Result> {
  createCache(): ResolverCache<Payload, Result>;
}
