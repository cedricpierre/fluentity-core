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
  options?: AdapterOptions;

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
export interface AdapterOptions {
  [key: string]: unknown | any;
}

/**
 * Interface for adapter responses.
 * Contains the response data from the API.
 *
 * @interface
 * @example
 * ```typescript
 * const response: AdapterResponse = {
 *   data: { id: 1, name: 'John' }
 * };
 * ```
 */
export interface AdapterResponse {
  /** The response data from the API */
  data: any;
}

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
 * @example
 * ```typescript
 * const options: FluentityOptions = {
 *   adapter: new RestAdapter()
 * };
 * ```
 */
export interface FluentityOptions {
  /** The adapter instance to use for API communication */
  adapter: AdapterInterface;
}

/**
 * Main Fluentity class that manages API communication.
 * Implements the singleton pattern to ensure a single instance is used throughout the application.
 * Handles adapter management and provides a central point for API communication.
 *
 * @example
 * ```typescript
 * // Initialize with custom adapter
 * Fluentity.initialize({
 *   adapter: new RestAdapter()
 * });
 *
 * // Get instance
 * const fluentity = Fluentity.getInstance();
 * ```
 */
export class Fluentity {
  /** Singleton instance of Fluentity */
  private static instance: Fluentity;

  /**
   * The adapter instance used for API communication.
   * @private
   */
  #adapter: AdapterInterface;

  /**
   * Creates a new Fluentity instance.
   * Private constructor to enforce singleton pattern.
   *
   * @param options - Configuration options for Fluentity
   * @throws {Error} If a Fluentity instance already exists
   * @private
   */
  private constructor(options?: FluentityOptions) {
    if (Fluentity.instance) {
      throw new Error('Fluentity instance already exists. Use getInstance() instead.');
    }
    this.#adapter = options?.adapter ?? new DefaultAdapter();
    Fluentity.instance = this;
  }

  /**
   * Gets the adapter instance used for API communication.
   *
   * @returns The configured adapter instance
   */
  public get adapter() {
    return this.#adapter;
  }

  /**
   * Initializes the Fluentity singleton instance.
   * Must be called before using any other Fluentity functionality.
   *
   * @param options - Configuration options for Fluentity
   * @returns The initialized Fluentity instance
   * @throws {Error} If Fluentity has already been initialized
   * @example
   * ```typescript
   * Fluentity.initialize({
   *   adapter: new RestAdapter({
   *     baseURL: 'https://api.example.com'
   *   })
   * });
   * ```
   */
  public static initialize(options?: FluentityOptions): Fluentity {
    if (Fluentity.instance) {
      throw new Error('Fluentity has already been initialized. Use getInstance() instead.');
    }
    return new Fluentity(options);
  }

  /**
   * Gets the Fluentity singleton instance.
   *
   * @returns The Fluentity instance
   * @throws {Error} If Fluentity has not been initialized
   * @example
   * ```typescript
   * const fluentity = Fluentity.getInstance();
   * ```
   */
  public static getInstance(): Fluentity {
    if (!Fluentity.instance) {
      throw new Error('Fluentity has not been initialized. Call initialize() first.');
    }
    return Fluentity.instance;
  }
}
