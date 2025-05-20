/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
export class HttpClient {
  static #cache: Map<string, CacheData> = new Map();
  static #url: string = ''

  static options: HttpClientOptions = {
    baseUrl: '', 
    options: {
      headers: {
        'Content-Type': 'application/json',
      }
    },
    requestInterceptor: undefined,
    responseInterceptor: undefined,
    errorInterceptor: undefined,
    requestHandler: fetchRequestHandler,
    cacheOptions: {
      enabled: false,
      ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
    }
  }

  /**
   * Configures the HTTP client with custom options.
   * @param opts - Partial configuration options to merge with existing options
   */
  static configure(opts: Partial<HttpClientOptions>) {
    this.options = { ...this.options, ...opts }
  }

  /**
   * Removes a specific URL from the cache.
   * @param url - The URL to remove from the cache
   */
  static deleteCache(url: string) {
    this.#cache.delete(url);
  }

  /**
   * Clears all cached responses.
   */
  static clearCache() {
    this.#cache.clear();
  }

  /**
   * Gets the current cache map containing all cached responses.
   * @returns The cache map
   */
  static get cache() {
    return this.#cache
  }

  /**
   * Retrieves cached data for a specific URL.
   * @param url - The URL to get cached data for
   * @returns The cached data if it exists
   */
  static getCache<T = any>(url: string): CacheData {
    return this.#cache.get(url) as CacheData
  }

  /**
   * Gets the last URL that was called.
   * @returns The last called URL
   */
  static get url() {
    return this.#url
  }

  /**
   * Makes an HTTP request to the specified URL with optional request options.
   * Handles caching, interceptors, and error handling.
   * @param url - The endpoint URL to call (will be appended to baseUrl)
   * @param options - Optional request configuration
   * @returns A promise that resolves to the response data
   * @throws Error if baseUrl is not configured or if the request fails
   */
  static async call<T = any>(
    url: string,
    options?: RequestOptions
  ): Promise<HttpResponse<T>> {
    try {
      this.#url = url

      if (!this.options.baseUrl) {
        throw new Error('baseUrl is required')
      }

      // Check cache if enabled
      if (this.options.cacheOptions?.enabled) {
        const cachedData = this.#cache.get(url);
        if (cachedData) {
          const now = Date.now();
          if (now - cachedData.timestamp < (this.options.cacheOptions.ttl || 0)) {
            return cachedData.data as HttpResponse<T>;
          }
          // Remove expired cache entry
          this.#cache.delete(url);
        }
      }

      const finalOptions = { ...options, ...this.options?.options } as RequestOptions
      const request = { url:`${this.options.baseUrl}/${url}`, options: finalOptions } as HttpRequest

      if (this.options.requestInterceptor) {
        Object.assign(request, this.options.requestInterceptor.call(this, request))
      }

      let response = await this.options.requestHandler!.call(this, request);

      if (this.options.responseInterceptor) {
        response = this.options.responseInterceptor.call(this, response)
      }

      // Store in cache if enabled
      if (this.options.cacheOptions?.enabled) {
        this.#cache.set(url, {
          data: response,
          timestamp: Date.now()
        });
      }
      
      return response
    } catch (error) {
      if (this.options.errorInterceptor && error instanceof Error) {
        this.options.errorInterceptor(error)
      }
      throw error
    }
  }
}

/**
 * Default request handler that uses the Fetch API to make HTTP requests.
 * @param request - The HTTP request configuration
 * @returns A promise that resolves to the JSON response
 * @throws Error if the request fails
 */
async function fetchRequestHandler(request: HttpRequest): Promise<HttpResponse> {
  const options = { ...request.options };

  if (options.headers?.['Content-Type'] === 'application/json' && options.body) {
    options.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(request.url, options as RequestInit);
    
    return {
      data: await response.json()
    } as HttpResponse
  } catch (error) {
    throw new Error(`HTTP error: ${error}`);
  }
};

/**
 * HTTP method constants for use in requests.
 */
export const Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
} as const;

export type MethodType = keyof typeof Methods;

/**
 * Configuration options for the HttpClient.
 */
export interface HttpClientOptions {
  /** Base URL to prepend to all requests */
  baseUrl?: string
  /** Default request options to apply to all requests */
  options?: RequestOptions,
  /** Interceptor to modify requests before they are sent */
  requestInterceptor?: (request: HttpRequest) => HttpRequest
  /** Interceptor to modify responses after they are received */
  responseInterceptor?: (response: HttpResponse) => HttpResponse
  /** Handler for request errors */
  errorInterceptor?: (error: Error) => void
  /** Custom request handler function */
  requestHandler?: (request: HttpRequest) => Promise<HttpResponse>
  /** Cache configuration options */
  cacheOptions?: CacheOptions
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
  url: string
  /** Request options including method, headers, body, etc. */
  options: RequestOptions
}

/**
 * Represents an HTTP response, which can be a single item or an array.
 */
export interface HttpResponse<T = any | any[]> {
  data: T
}

/**
 * Configuration options for HTTP requests.
 * Extends the standard Fetch API RequestInit interface with additional options.
 */
export interface RequestOptions {
  /** Request body data */
  body?: any,
  /** HTTP method to use */
  method?: MethodType,
  /** Request headers */
  headers?: Record<string, string>
  /** Request credentials mode */
  credentials?: RequestCredentials
  /** Request mode */
  mode?: RequestMode
  /** How to handle redirects */
  redirect?: RequestRedirect
  /** Referrer URL */
  referrer?: string
  /** Referrer policy */
  referrerPolicy?: ReferrerPolicy
  /** Subresource integrity value */
  integrity?: string
  /** Cache mode */
  cache?: RequestCache
  /** Whether to keep the connection alive */
  keepalive?: boolean
  /** Abort signal for cancelling the request */
  signal?: AbortSignal
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