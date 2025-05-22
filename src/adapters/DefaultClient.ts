import { AdapterInterface, AdapterResponse } from "../Fluentity";

import { AdapterOptions } from "../Fluentity";

export class DefaultClient implements AdapterInterface {
  async call(options: AdapterOptions): Promise<AdapterResponse> {
    return { data: {} };
  }

  configure(options: Partial<AdapterOptions>): void {
    // No-op for mock adapter
  }
}
