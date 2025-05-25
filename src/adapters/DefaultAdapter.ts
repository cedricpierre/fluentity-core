import { AdapterInterface, AdapterOptions, AdapterResponse, QueryBuilder } from '../Fluentity';

export class DefaultAdapter implements AdapterInterface {
  options: AdapterOptions = {};
  async call(_queryBuilder: QueryBuilder): Promise<AdapterResponse> {
    return Promise.resolve({ data: undefined });
  }

  configure(_options: Partial<AdapterOptions>): void {
    // No-op for mock adapter
  }
}
