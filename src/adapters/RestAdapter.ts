import { QueryBuilder } from '../QueryBuilder';
import { HttpAdapter, HttpAdapterOptions, HttpRequest, HttpResponse } from './HttpAdapter';

/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
export class RestAdapter extends HttpAdapter {
  declare options: RestAdapterOptions;

  /**
   * Constructor for the RestAdapter class.
   * @param options - Partial configuration options to merge with existing options
   */
  constructor(options: Partial<RestAdapterOptions>) {
    super(options);
    // Merge options while preserving parent class defaults
    this.options = { ...this.options, ...options } as RestAdapterOptions;
  }

  protected buildRequest(queryBuilder: QueryBuilder): HttpRequest {
    return new HttpRequest({
      url: this.buildUrl(queryBuilder),
      method: queryBuilder.method,
      body: queryBuilder.body,
      options: this.options?.options,
    });
  }
  /**
   * Builds the final URL for the API request.
   * @returns The constructed URL with query parameters
   */
  private buildUrl(queryBuilder: QueryBuilder): string {
    const queryString = this.toQueryString(queryBuilder);

    let segments: Array<string> = [];

    segments = this.unwrapParents(queryBuilder, segments);

    let url = segments.join('/');
    if (queryString) {
      url += `?${queryString}`;
    }
    
    return decodeURIComponent(url);
  }

  private unwrapParents(queryBuilder: QueryBuilder, segments: Array<string>): Array<string> {
    if (queryBuilder.parent) {
      this.unwrapParents(queryBuilder.parent, segments);
    }

    segments.push(queryBuilder.url ?? queryBuilder.model?.resource);

    if (queryBuilder.id) {
      segments.push(`${queryBuilder.id}`);
    }

    return segments;
  }

  /**
   * Builds a query string from the query builder.
   * @param queryBuilder - The query builder to build the query string from
   * @returns The constructed query string
   */
  private toQueryString(queryBuilder: QueryBuilder): string {
    const obj: Record<string, unknown> = { ...queryBuilder.query };

    obj.page = queryBuilder.page;
    obj.perPage = queryBuilder.perPage;
    obj.sort = queryBuilder.sort;
    obj.direction = queryBuilder.direction;
    obj.limit = queryBuilder.limit;
    obj.offset = queryBuilder.offset;

    return Object.entries(obj)
      .filter(([_key, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
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
 * Configuration options for the RestAdapter.
 * Extends HttpAdapterOptions with any additional REST-specific options.
 */
export interface RestAdapterOptions extends HttpAdapterOptions {
  // Add any REST-specific options here
}
