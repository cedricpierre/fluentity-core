import {
  AdapterInterface,
  AdapterOptions,
  AdapterRequest,
  AdapterResponse,
} from '../Fluentity';
import { QueryBuilder } from '../QueryBuilder';


/**
 * HTTP method constants for use in requests.
 * Provides type-safe HTTP method names.
 *
 * @example
 * ```typescript
 * const method: MethodType = Methods.POST;
 * ```
 */
export const Methods = {
  /** HTTP GET method */
  GET: 'GET',
  /** HTTP POST method */
  POST: 'POST',
  /** HTTP PUT method */
  PUT: 'PUT',
  /** HTTP PATCH method */
  PATCH: 'PATCH',
  /** HTTP DELETE method */
  DELETE: 'DELETE',
  /** HTTP HEAD method */
  HEAD: 'HEAD',
  /** HTTP OPTIONS method */
  OPTIONS: 'OPTIONS',
} as const;

/**
 * Type representing valid HTTP method names.
 * Derived from the Methods constant object.
 */
export type MethodType = keyof typeof Methods;

/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
export abstract class HttpAdapter implements AdapterInterface {
  protected _cache: WeakMap<HttpRequest, CacheData> = new WeakMap();

  options: HttpAdapterOptions = {
    baseUrl: '',
    options: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    requestInterceptor: undefined,
    responseInterceptor: undefined,
    errorInterceptor: undefined,
    requestHandler: this.fetchRequestHandler,
    cacheOptions: {
      enabled: false,
      ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
    },
  };
  /**
   * The request object.
   */
  private _request: HttpRequest = new HttpRequest();

  /**
   * Constructor for the RestAdapter class.
   * @param options - Partial configuration options to merge with existing options
   */
  constructor(options: Partial<HttpAdapterOptions>) {
    if (!options.baseUrl) {
      throw new Error('baseUrl is required');
    }

    this.options = { ...this.options, ...options };
  }

  configure(options: Partial<HttpAdapterOptions>): this {
    this.options = { ...this.options, ...options };
    return this;
  }



  /**
   * The request object.
   */
  get request(): HttpRequest {
    return this._request;
  }

  /**
   * Clears all cached responses.
   */
  clearCache(): this {
    this._cache = new WeakMap();
    return this;
  }

  /**
   * Makes an HTTP request to the specified URL with optional request options.
   * Handles caching, interceptors, and error handling.
   * @param queryBuilder - Optional request configuration
   * @returns A promise that resolves to the response data
   * @throws Error if baseUrl is not configured or if the request fails
   */
  async call(queryBuilder: QueryBuilder): Promise<HttpResponse> {
    try {
      if (!this.options.baseUrl) {
        throw new Error('baseUrl is required');
      }

      this._request = this.buildRequest(queryBuilder);

      // Check cache if enabled
      if (this.options.cacheOptions?.enabled) {
        const cachedData = this._cache.get(this._request);
        if (cachedData) {
          const now = Date.now();
          if (now - cachedData.timestamp < (this.options.cacheOptions.ttl || 0)) {
            return cachedData;
          }
          // Remove expired cache entry
          this._cache.delete(this._request);
        }
      }

      if (this.options.requestInterceptor) {
        Object.assign(this._request, this.options.requestInterceptor.call(this, this._request));
      }

      let response = await this.options.requestHandler!.call(this, this._request);

      if (this.options.responseInterceptor) {
        response = this.options.responseInterceptor.call(this, response);
      }

      // Store in cache if enabled
      if (this.options.cacheOptions?.enabled) {
        this._cache.set(this._request, {
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

  protected buildRequest(queryBuilder: QueryBuilder): HttpRequest {
    return new HttpRequest({
      url: '',
      method: queryBuilder.method,
      body: queryBuilder.body,
      options: this.options?.options,
    });
  }

  protected async fetchRequestHandler(_request: HttpRequest): Promise<HttpResponse> {
    return Promise.resolve(new HttpResponse());
  }
}

/**
 * Configuration options for the HttpClient.
 */
export interface HttpAdapterOptions<T = unknown | any> extends AdapterOptions {
  /** Base URL to prepend to all requests */
  baseUrl?: string;
  /** Default request options to apply to all requests */
  options?: HttpRequestOptions;
  /** Interceptor to modify requests before they are sent */
  requestInterceptor?: (request: HttpRequest) => HttpRequest;
  /** Interceptor to modify responses after they are received */
  responseInterceptor?: (response: HttpResponse<T>) => HttpResponse<T>;
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

export interface HttpRequestInterface {
  /** The full URL to send the request to */
  url: string;
  /** Request options including method, headers, body, etc. */
  options?: HttpRequestOptions;
  /** HTTP method to use */
  method?: MethodType;
  /** Request body data */
  body?: string | object | object[] | undefined;
}

/**
 * Represents an HTTP request configuration.
 */
export class HttpRequest implements HttpRequestInterface, AdapterRequest {
  /** The full URL to send the request to */
  url: string = '';
  options?: HttpRequestOptions;
  method?: MethodType;
  body?: string | any | any[];

  constructor(options?: Partial<HttpRequestInterface>) {
    if (options) {
      Object.assign(this, options);
    }
  }
}

export interface HttpResponseInterface {
  data: any
}

export class HttpResponse<T = any> implements HttpResponseInterface, AdapterResponse<T> {
  data: T = {} as T;

  constructor(options?: Partial<HttpResponseInterface>) {
    if (options) {
      Object.assign(this, options);
    }
  }
}

/**
 * Configuration options for HTTP requests.
 * Extends the standard Fetch API RequestInit interface with additional options.
 */
export interface HttpRequestOptions extends AdapterOptions {
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
  data: HttpResponse;
  /** Timestamp when the data was cached (milliseconds since epoch) */
  timestamp: number;
}
