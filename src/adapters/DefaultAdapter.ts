import { AdapterInterface, AdapterResponse, QueryBuilder } from '../Fluentity';

export class DefaultAdapter implements AdapterInterface {
  async call(_queryBuilder: QueryBuilder): Promise<AdapterResponse> {
    return Promise.resolve({ data: undefined });
  }

  configure(): void {
    // No-op for mock adapter
  }
}
