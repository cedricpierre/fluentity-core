import { AdapterInterface, AdapterResponse, AdapterOptions } from '../Fluentity';

export class DefaultAdapter implements AdapterInterface {
  async call(options: AdapterOptions): Promise<AdapterResponse> {
    return { data: {} };
  }

  configure(): void {
    // No-op for mock adapter
  }
}
