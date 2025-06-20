import { MethodType, Model } from './index';
export interface QueryBuilderOptions {
    model?: typeof Model;
    id?: string | number;
    parent?: QueryBuilder;
    query?: Record<string, any>;
    sort?: string;
    direction?: string;
    limit?: number;
    offset?: number;
    page?: number;
    perPage?: number;
    method?: MethodType;
    body?: any;
    url?: string;
}
/**
 * Builder class for constructing URL query strings and API requests.
 * Provides a fluent interface for building and managing query parameters for API requests.
 * Used internally by models and relation builders to construct API calls.
 *
 * The QueryBuilder supports:
 * - Query parameter management
 * - Sorting and pagination
 * - HTTP method specification
 * - Request body handling
 *
 * @example
 * ```typescript
 * // Basic query with filters and pagination
 * const query = new QueryBuilder()
 *   .where({ status: 'active' })
 *   .orderBy('created_at', 'desc')
 *   .limit(10)
 *   .offset(20);
 *
 * // Complex query with multiple conditions
 * const query = new QueryBuilder()
 *   .filter({
 *     age: { gt: 18, lt: 65 },
 *     status: ['active', 'pending']
 *   })
 *   .orderBy('name', 'asc')
 *   .page(2, 25);
 * ```
 */
export declare class QueryBuilder {
    constructor(options?: QueryBuilderOptions);
    url?: string;
    /** The model for the query builder */
    model?: Model;
    /** Resource ID for single-resource operations */
    id?: string | number | BigInt;
    /** The parents of the query builder */
    parent?: QueryBuilder;
    /** Query parameters to be added to the URL */
    query?: Record<string, any>;
    /** Field to sort results by */
    sort?: string;
    /** Sort direction ('asc' or 'desc') */
    direction?: string;
    /** Maximum number of results to return */
    limit?: number;
    /** Number of results to skip */
    offset?: number;
    /** Page number for pagination */
    page?: number;
    /** Number of items per page */
    perPage?: number;
    /** HTTP method to use for the request */
    method?: MethodType;
    /** Request body data */
    body?: any;
    /**
     * Adds where conditions to the query.
     * Shorthand for filter() that adds exact field-value matches.
     * Multiple calls to where() will merge the conditions.
     *
     * @param where - Object containing field-value pairs to filter by
     * @returns The QueryBuilder instance for method chaining
     * @example
     * ```typescript
     * // Simple equality conditions
     * query.where({ status: 'active', type: 'user' });
     *
     * // Multiple where calls are merged
     * query.where({ status: 'active' })
     *      .where({ type: 'user' });
     * ```
     */
    where(where: Record<string, any>): this;
    /**
     * Adds filter conditions to the query.
     * Supports more complex filtering operations than where().
     * Can handle comparison operators, arrays, and nested conditions.
     *
     * @param filters - Object containing filter conditions
     * @returns The QueryBuilder instance for method chaining
     * @example
     * ```typescript
     * // Comparison operators
     * query.filter({
     *   age: { gt: 18, lt: 65 },
     *   price: { gte: 10, lte: 100 }
     * });
     *
     * // Array conditions
     * query.filter({
     *   status: ['active', 'pending'],
     *   tags: { in: ['featured', 'popular'] }
     * });
     *
     * // Nested conditions
     * query.filter({
     *   user: {
     *     profile: { verified: true },
     *     role: 'admin'
     *   }
     * });
     * ```
     */
    filter(filters: Record<string, any>): this;
    /**
     * Resets the query builder to its initial state.
     * Clears all query parameters, pagination settings, and request options.
     * Useful for reusing a query builder instance with different parameters.
     *
     * @example
     * ```typescript
     * // Reset after a complex query
     * query.where({ status: 'active' })
     *      .orderBy('created_at', 'desc')
     *      .limit(10)
     *      .reset();
     *
     * // Reuse for a new query
     * query.where({ type: 'user' })
     *      .orderBy('name', 'asc');
     * ```
     */
    reset(): void;
    /**
     * Converts the query builder to a plain object.
     * Used internally to construct the final query parameters for API requests.
     * Only includes non-undefined values in the output.
     *
     * @returns A plain object containing all non-undefined query parameters
     * @example
     * ```typescript
     * const query = new QueryBuilder()
     *   .where({ status: 'active' })
     *   .limit(10);
     *
     * const params = query.toObject();
     * // {
     * //   query: { status: 'active' },
     * //   limit: 10
     * // }
     * ```
     */
    toObject(): Record<string, any>;
}
