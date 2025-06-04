import { AdapterInterface, AdapterOptions, AdapterRequest, AdapterResponse, MethodType } from '../Fluentity';
import { QueryBuilder } from '../QueryBuilder';
/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
export declare abstract class HttpAdapter implements AdapterInterface {
    protected _cache: WeakMap<HttpRequest, CacheData>;
    options: HttpAdapterOptions;
    /**
     * The request object.
     */
    private _request;
    /**
     * Constructor for the RestAdapter class.
     * @param options - Partial configuration options to merge with existing options
     */
    constructor(options: Partial<HttpAdapterOptions>);
    configure(options: Partial<HttpAdapterOptions>): this;
    /**
     * The request object.
     */
    get request(): HttpRequest;
    /**
     * Clears all cached responses.
     */
    clearCache(): this;
    /**
     * Makes an HTTP request to the specified URL with optional request options.
     * Handles caching, interceptors, and error handling.
     * @param queryBuilder - Optional request configuration
     * @returns A promise that resolves to the response data
     * @throws Error if baseUrl is not configured or if the request fails
     */
    call(queryBuilder: QueryBuilder): Promise<HttpResponse>;
    protected buildUrl(_queryBuilder: QueryBuilder): string;
    protected fetchRequestHandler(_request: HttpRequest): Promise<HttpResponse>;
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
export declare class HttpRequest implements HttpRequestInterface, AdapterRequest {
    /** The full URL to send the request to */
    url: string;
    options?: HttpRequestOptions;
    method?: MethodType;
    body?: string;
    constructor(options?: Partial<HttpRequestInterface>);
}
export interface HttpResponseInterface {
    data: any;
}
export declare class HttpResponse<T = any> implements HttpResponseInterface, AdapterResponse<T> {
    data: T;
    constructor(options?: Partial<HttpResponseInterface>);
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
