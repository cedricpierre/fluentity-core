import { MethodType } from './Fluentity';

export interface QueryBuilderOptions {
  resource?: string;
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
}

/**
 * Builder class for constructing URL query strings and API requests.
 * Provides a fluent interface for building and managing query parameters for API requests.
 * Used internally by models and relation builders to construct API calls.
 * 
 * The QueryBuilder supports:
 * - Resource path construction
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
export class QueryBuilder {
  constructor(options?: QueryBuilderOptions) {
    if (options) {
      Object.assign(this, options);
    }
  }
  /** The resource name for the API endpoint */
  public resource?: string;
  /** Resource ID for single-resource operations */
  public id?: string | number;
  /** The parents of the query builder */
  public parent?: QueryBuilder;
  /** Query parameters to be added to the URL */
  public query?: Record<string, any> = {};
  /** Field to sort results by */
  public sort?: string;
  /** Sort direction ('asc' or 'desc') */
  public direction?: string;
  /** Maximum number of results to return */
  public limit?: number;
  /** Number of results to skip */
  public offset?: number;
  /** Page number for pagination */
  public page?: number;
  /** Number of items per page */
  public perPage?: number;
  /** HTTP method to use for the request */
  public method?: MethodType;
  /** Request body data */
  public body?: any;

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
  where(where: Record<string, any>): this {
    this.filter(where);
    return this;
  }

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
  filter(filters: Record<string, any>): this {
    this.query = { ...this.query, ...filters };

    return this;
  }

  /**
   * Resets the query builder to its initial state.
   * Clears all query parameters, pagination settings, and request options.
   * Useful for reusing a query builder instance with different parameters.
   *
   * @returns The QueryBuilder instance for method chaining
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
  reset(): void {
    this.id = undefined;
    this.query = {};
    this.sort = undefined;
    this.direction = undefined;
    this.limit = undefined;
    this.offset = undefined;
    this.page = undefined;
    this.perPage = undefined;
    this.method = undefined;
    this.body = undefined;
  }

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
  toObject(): Record<string, any> {
    return Object.entries({
      query: this.query,
      method: this.method,
      sort: this.sort,
      direction: this.direction,
      limit: this.limit,
      offset: this.offset,
      page: this.page,
      perPage: this.perPage,
    })
      .filter(([_, value]) => value !== undefined)
      .reduce((acc: Record<string, any>, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }
}
