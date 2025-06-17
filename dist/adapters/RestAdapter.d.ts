import { QueryBuilder } from '../QueryBuilder';
import { HttpAdapter, HttpAdapterOptions, HttpRequest, HttpResponse } from './HttpAdapter';
/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
export declare class RestAdapter extends HttpAdapter {
    options: RestAdapterOptions;
    /**
     * Constructor for the RestAdapter class.
     * @param options - Partial configuration options to merge with existing options
     */
    constructor(options: Partial<RestAdapterOptions>);
    protected buildRequest(queryBuilder: QueryBuilder): HttpRequest;
    /**
     * Builds the final URL for the API request.
     * @returns The constructed URL with query parameters
     */
    private buildUrl;
    private unwrapParents;
    /**
     * Builds a query string from the query builder.
     * @param queryBuilder - The query builder to build the query string from
     * @returns The constructed query string
     */
    private toQueryString;
    protected fetchRequestHandler(request: HttpRequest): Promise<HttpResponse>;
}
/**
 * Configuration options for the RestAdapter.
 * Extends HttpAdapterOptions with any additional REST-specific options.
 */
export interface RestAdapterOptions extends HttpAdapterOptions {
}
