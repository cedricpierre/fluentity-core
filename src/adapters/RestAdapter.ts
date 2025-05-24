import { AdapterInterface, AdapterOptions, AdapterResponse, MethodType } from '../Fluentity';
import { QueryBuilder } from '../QueryBuilder';

/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
export class RestAdapter implements AdapterInterface {
  #cache: Map<string, CacheData> = new Map();
  #url: string = '';

  options: RestAdapterOptions = {
    baseUrl: '',
    options: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    requestInterceptor: undefined,
    responseInterceptor: undefined,
    errorInterceptor: undefined,
    requestHandler: fetchRequestHandler,
    cacheOptions: {
      enabled: false,
      ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
    },
  };

  /**
   * Constructor for the RestAdapter class.
   * @param options - Partial configuration options to merge with existing options
   */
  constructor(options: Partial<RestAdapterOptions>) {
    this.options = { ...this.options, ...options };
  }

  configure(options: Partial<RestAdapterOptions>) {
    this.options = { ...this.options, ...options };
  }

  /**
   * Removes a specific URL from the cache.
   * @param url - The URL to remove from the cache
   */
  deleteCache(url: string) {
    this.#cache.delete(url);
  }

  /**
   * Clears all cached responses.
   */
  clearCache() {
    this.#cache.clear();
  }

  /**
   * Gets the current cache map containing all cached responses.
   * @returns The cache map
   */
  get cache() {
    return this.#cache;
  }

  /**
   * Retrieves cached data for a specific URL.
   * @param url - The URL to get cached data for
   * @returns The cached data if it exists
   */
  getCache(url: string): CacheData {
    return this.#cache.get(url) as CacheData;
  }

  get url(): string {
    return this.#url;
  }

  /**
   * Makes an HTTP request to the specified URL with optional request options.
   * Handles caching, interceptors, and error handling.
   * @param url - The endpoint URL to call (will be appended to baseUrl)
   * @param queryBuilder - Optional request configuration
   * @returns A promise that resolves to the response data
   * @throws Error if baseUrl is not configured or if the request fails
   */
  async call<T = any>(queryBuilder: QueryBuilder): Promise<AdapterResponse> {
    try {
      this.#url = this.buildUrl(queryBuilder);

      if (!this.options.baseUrl) {
        throw new Error('baseUrl is required');
      }

      // Check cache if enabled
      if (this.options.cacheOptions?.enabled) {
        const cachedData = this.#cache.get(this.#url);
        if (cachedData) {
          const now = Date.now();
          if (now - cachedData.timestamp < (this.options.cacheOptions.ttl || 0)) {
            return cachedData.data as HttpResponse<T>;
          }
          // Remove expired cache entry
          this.#cache.delete(this.#url);
        }
      }

      const request: HttpRequest = {
        url: `${this.options.baseUrl}/${this.#url}`,
        method: queryBuilder.method,
        body: queryBuilder.body,
        options: this.options?.options,
      };

      if (this.options.requestInterceptor) {
        Object.assign(request, this.options.requestInterceptor.call(this, request));
      }

      let response = await this.options.requestHandler!.call(this, request);

      if (this.options.responseInterceptor) {
        response = this.options.responseInterceptor.call(this, response);
      }

      // Store in cache if enabled
      if (this.options.cacheOptions?.enabled) {
        this.#cache.set(this.#url, {
          data: response,
          timestamp: Date.now(),
        });
      }

      return response;
    } catch (error) {
      if (this.options.errorInterceptor && error instanceof Error) {
        this.options.errorInterceptor(error);
      }
      throw error;
    }
  }

  /**
   * Builds the final URL for the API request.
   * @returns The constructed URL with query parameters
   */
  private buildUrl(queryBuilder: QueryBuilder) {
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

    if (queryBuilder.resource && queryBuilder.id) {
      segments.push(`${queryBuilder.resource}/${queryBuilder.id}`);
    } else if (queryBuilder.resource) {
      segments.push(`${queryBuilder.resource}`);
    }

    return segments;
  }

  /**
   * Builds a query string from the query builder.
   * @param queryBuilder - The query builder to build the query string from
   * @returns The constructed query string
   */
  private toQueryString(queryBuilder: QueryBuilder): string {
    const obj: Record<string, any> = { ...queryBuilder.query };

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
}

/**
 * Default request handler that uses the Fetch API to make HTTP requests.
 * @param request - The HTTP request configuration
 * @returns A promise that resolves to the JSON response
 * @throws Error if the request fails
 */
async function fetchRequestHandler(request: HttpRequest): Promise<HttpResponse> {
  if (request.options?.headers?.['Content-Type'] === 'application/json' && request.body) {
    request.body = JSON.stringify(request.body);
  }

  try {
    const response = await fetch(request.url, {
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

    return {
      data: await response.json(),
    } as HttpResponse;
  } catch (error) {
    throw new Error(`HTTP error: ${error}`);
  }
}

/**
 * Configuration options for the HttpClient.
 */
export interface RestAdapterOptions {
  /** Base URL to prepend to all requests */
  baseUrl?: string;
  /** Default request options to apply to all requests */
  options?: RequestOptions;
  /** Interceptor to modify requests before they are sent */
  requestInterceptor?: (request: HttpRequest) => HttpRequest;
  /** Interceptor to modify responses after they are received */
  responseInterceptor?: (response: HttpResponse) => HttpResponse;
  /** Handler for request errors */
  errorInterceptor?: (error: Error) => void;
  /** Custom request handler function */
  requestHandler?: (request: HttpRequest) => Promise<HttpResponse>;
  /** Cache configuration options */
  cacheOptions?: CacheOptions;
}

/**
 * Configuration options for response caching.
 */
export interface CacheOptions {
  /** Whether caching is enabled */
  enabled: boolean;
  /** Time-to-live for cached responses in milliseconds */
  ttl?: number;
}

/**
 * Represents an HTTP request configuration.
 */
export interface HttpRequest {
  /** The full URL to send the request to */
  url: string;
  /** Request options including method, headers, body, etc. */
  options?: RequestOptions;
  /** HTTP method to use */
  method?: MethodType;
  /** Request body data */
  body?: any;
}

/**
 * Represents an HTTP response, which can be a single item or an array.
 */
export interface HttpResponse<T = any | any[]> extends AdapterResponse {
  data: T;
}

/**
 * Configuration options for HTTP requests.
 * Extends the standard Fetch API RequestInit interface with additional options.
 */
export interface RequestOptions extends AdapterOptions {
  /** Request headers */
  headers?: Record<string, string>;
  /** Request credentials mode */
  credentials?: RequestCredentials;
  /** Request mode */
  mode?: RequestMode;
  /** How to handle redirects */
  redirect?: RequestRedirect;
  /** Referrer URL */
  referrer?: string;
  /** Referrer policy */
  referrerPolicy?: ReferrerPolicy;
  /** Subresource integrity value */
  integrity?: string;
  /** Cache mode */
  cache?: RequestCache;
  /** Whether to keep the connection alive */
  keepalive?: boolean;
  /** Abort signal for cancelling the request */
  signal?: AbortSignal;
}

/**
 * Represents cached data with its timestamp.
 */
export interface CacheData {
  /** The cached response data */
  data: any;
  /** Timestamp when the data was cached (milliseconds since epoch) */
  timestamp: number;
}
