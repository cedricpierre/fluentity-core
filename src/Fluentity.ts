import { DefaultAdapter } from './adapters/DefaultAdapter';
import { QueryBuilder } from './QueryBuilder';

/**
 * Interface for adapters that handle API communication.
 * Adapters must implement methods for making HTTP requests and configuration.
 *
 * @interface
 * @example
 * ```typescript
 * class CustomAdapter implements AdapterInterface {
 *   async call(queryBuilder: QueryBuilder): Promise<AdapterResponse> {
 *     // Make HTTP request
 *   }
 *   configure(options: Partial<AdapterOptions>): void {
 *     // Configure adapter
 *   }
 * }
 * ```
 */
export interface AdapterInterface {
  /**
   * The options for the adapter.
   * Contains configuration settings specific to the adapter implementation.
   */
  options: AdapterOptions;

  /**
   * Makes an API request using the adapter's implementation.
   *
   * @param queryBuilder - The query builder containing request details
   * @returns Promise resolving to the API response
   * @throws {Error} If the request fails
   */
  call(queryBuilder: QueryBuilder): Promise<AdapterResponse>;

  /**
   * Configures the adapter with additional options.
   *
   * @param options - The configuration options to apply
   * @example
   * ```typescript
   * adapter.configure({
   *   baseURL: 'https://api.example.com',
   *   timeout: 5000
   * });
   * ```
   */
  configure(options: Partial<AdapterOptions>): void;
}

/**
 * Base interface for adapter request options.
 * Can be extended with additional properties by specific adapters.
 *
 * @interface
 * @example
 * ```typescript
 * interface CustomAdapterOptions extends AdapterOptions {
 *   apiKey: string;
 *   retryCount: number;
 * }
 * ```
 */
export type AdapterOptions = Record<string, unknown>;

export interface AdapterRequest {}

/**
 * Interface for adapter responses.
 * Contains the response data from the API.
 *
 * @interface
 * @example
 * ```typescript
 * // For a single object response
 * const response: AdapterResponse<User> = {
 *   data: { id: 1, name: 'John' }
 * };
 *
 * // For an array response
 * const response: AdapterResponse<User[]> = {
 *   data: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 * };
 * ```
 */
export type AdapterResponse<T = unknown | any> = {
  /** The response data from the API */
  data: T;
};

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
 * Configuration options for initializing Fluentity.
 *
 * @interface
 * @template A - The type of adapter to use
 * @example
 * ```typescript
 * const options: FluentityOptions<RestAdapter> = {
 *   adapter: new RestAdapter()
 * };
 * ```
 */
export interface FluentityOptions<A extends AdapterInterface = DefaultAdapter> {
  /** The adapter instance to use for API communication */
  adapter?: A;
}

/**
 * Main Fluentity class that manages API communication.
 * Implements the singleton pattern to ensure a single instance is used throughout the application.
 * Handles adapter management and provides a central point for API communication.
 *
 * @class
 * @template A - The type of adapter being used
 * @example
 * ```typescript
 * // Initialize with custom adapter
 * Fluentity.initialize({
 *   adapter: new RestAdapter()
 * });
 *
 * // Get instance
 * const fluentity = Fluentity.getInstance();
 *
 * // Use the adapter
 * const response = await fluentity.adapter.call(queryBuilder);
 * ```
 */
export class Fluentity<A extends AdapterInterface = DefaultAdapter> {
  /**
   * Singleton instance of Fluentity.
   * @private
   * @static
   */
  private static instance: Fluentity<any>;

  /**
   * The adapter instance used for API communication.
   * @private
   * @readonly
   */
  #adapter: A;

  /**
   * Creates a new Fluentity instance.
   * Private constructor to enforce singleton pattern.
   *
   * @param {FluentityOptions<A>} [options] - Configuration options for Fluentity
   * @throws {Error} If a Fluentity instance already exists
   * @private
   */
  private constructor(options?: FluentityOptions<A>) {
    if (Fluentity.instance) {
      throw new Error('Fluentity instance already exists. Use getInstance() instead.');
    }
    this.#adapter = (options?.adapter ?? new DefaultAdapter()) as A;

    Fluentity.instance = this;
  }

  /**
   * Gets the adapter instance used for API communication.
   *
   * @returns {A} The configured adapter instance
   * @public
   * @readonly
   */
  public get adapter(): A {
    return this.#adapter;
  }

  /**
   * Initializes the Fluentity singleton instance.
   * Must be called before using any other Fluentity functionality.
   *
   * @param {FluentityOptions<A>} [options] - Configuration options for Fluentity
   * @returns {Fluentity<A>} The initialized Fluentity instance
   * @throws {Error} If Fluentity has already been initialized
   * @static
   * @example
   * ```typescript
   * // Initialize with default adapter
   * Fluentity.initialize();
   *
   * // Initialize with custom adapter
   * Fluentity.initialize({
   *   adapter: new RestAdapter({
   *     baseURL: 'https://api.example.com'
   *   })
   * });
   * ```
   */
  public static initialize<A extends AdapterInterface = DefaultAdapter>(
    options?: FluentityOptions<A>
  ): Fluentity<A> {
    if (Fluentity.instance) {
      throw new Error('Fluentity has already been initialized. Use getInstance() instead.');
    }
    return new Fluentity<A>(options);
  }

  /**
   * Gets the Fluentity singleton instance.
   *
   * @returns {Fluentity<A>} The Fluentity instance
   * @throws {Error} If Fluentity has not been initialized
   * @static
   * @example
   * ```typescript
   * // Get the instance after initialization
   * const fluentity = Fluentity.getInstance<CustomAdapter>();
   *
   * // The adapter type is automatically inferred
   * const adapter = fluentity.adapter;
   * ```
   */
  public static getInstance<A extends AdapterInterface = DefaultAdapter>(): Fluentity<A> {
    if (!Fluentity.instance) {
      throw new Error('Fluentity has not been initialized. Call initialize() first.');
    }
    return Fluentity.instance as Fluentity<A>;
  }

  /**
   * Calls the adapter with the given query builder.
   * @param queryBuilder - The query builder to use
   * @returns The adapter response
   * @public
   */
  call(queryBuilder: QueryBuilder): Promise<AdapterResponse> {
    return this.#adapter.call(queryBuilder);
  }

  /**
   * Calls the adapter with the given query builder.
   * @param queryBuilder - The query builder to use
   * @returns The adapter response
   * @static
   */
  static call(queryBuilder: QueryBuilder): Promise<AdapterResponse> {
    return Fluentity.getInstance().call(queryBuilder);
  }
}

// Export QueryBuilder type
export type { QueryBuilder } from './QueryBuilder';
