import { AdapterInterface, AdapterOptions, AdapterResponse, QueryBuilder } from '../Fluentity';
/**
 * Default adapter implementation that provides no-op behavior.
 * Used as a fallback when no specific adapter is configured.
 * Returns undefined data for all requests.
 *
 * @example
 * ```typescript
 * // Used automatically when no adapter is specified
 * Fluentity.initialize();
 *
 * // Or explicitly
 * Fluentity.initialize({
 *   adapter: new DefaultAdapter()
 * });
 * ```
 */
export declare class DefaultAdapter implements AdapterInterface {
    options: AdapterOptions;
    /**
     * Makes a mock API request that always returns undefined data.
     * This is a no-op implementation for testing or when no real API is available.
     *
     * @param _queryBuilder - The query builder (unused in this implementation)
     * @returns Promise resolving to an empty response
     * @example
     * ```typescript
     * const adapter = new DefaultAdapter();
     * const response = await adapter.call(new QueryBuilder());
     * // response.data is undefined
     * ```
     */
    call(_queryBuilder: QueryBuilder): Promise<AdapterResponse>;
    /**
     * Configures the adapter with options (no-op in this implementation).
     * This method exists to satisfy the AdapterInterface contract.
     *
     * @param _options - Configuration options (unused in this implementation)
     * @example
     * ```typescript
     * const adapter = new DefaultAdapter();
     * adapter.configure({ baseURL: 'https://example.com' }); // No effect
     * ```
     */
    configure(_options: Partial<AdapterOptions>): void;
}
