import { QueryBuilder } from '../QueryBuilder';
import { HttpAdapter, HttpAdapterOptions, HttpRequest, HttpResponse } from './HttpAdapter';

/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
export class GraphqlAdapter extends HttpAdapter {
  options: GraphqlAdapterOptions;

  /**
   * Constructor for the RestAdapter class.
   * @param options - Partial configuration options to merge with existing options
   */
  constructor(options: Partial<GraphqlAdapterOptions>) {
    super(options);

    if (!options.endpoint) {
      throw new Error('GraphqlAdapter requires an endpoint');
    }

    this.options = { ...this.options, ...options } as GraphqlAdapterOptions;
  }

  protected buildRequest(queryBuilder: QueryBuilder): HttpRequest {
    return new HttpRequest({
      url: this.options.endpoint ?? '/graphql',
      method: queryBuilder.method,
      body: queryBuilder.body,
      options: this.options?.options,
    });
  }

  protected async fetchRequestHandler(request: HttpRequest): Promise<HttpResponse> {
    if (request.options?.headers?.['Content-Type'] === 'application/json' && request.body) {
      request.body = JSON.stringify(request.body);
    }

    try {
      const response = await fetch(`${this.options.baseUrl}/${request.url}`, {
        method: request.method,
        body: ['PUT', 'POST', 'PATCH'].includes(request.method!) ? request.body : null,
        headers: request.options?.headers,
        credentials: request.options?.credentials,
        mode: request.options?.mode,
        redirect: request.options?.redirect,
        referrer: request.options?.referrer,
        cache: request.options?.cache,
        keepalive: request.options?.keepalive,
        signal: request.options?.signal,
      } as RequestInit);

      return new HttpResponse({
        data: await response.json(),
      });
    } catch (error) {
      throw new Error(`HTTP error: ${error}`);
    }
  }
}

/**
 * Configuration options for the HttpClient.
 */
export type GraphqlAdapterOptions = {
  endpoint?: string;
} & HttpAdapterOptions;
