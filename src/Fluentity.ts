import { DefaultClient } from "./adapters/DefaultClient";

/**
 * Interface for adapters that handle API communication.
 * Adapters must implement a call method to make requests.
 */
export interface AdapterInterface {
  /**
   * Makes an API request using the adapter's implementation.
   * @param data - The request options and data
   * @returns Promise resolving to the API response
   */
  call(data: AdapterOptions): Promise<AdapterResponse>;
  /**
   * Configures the adapter with additional options.
   * @param options - The configuration options to apply
   */
  configure(options: Partial<AdapterOptions>): void;
}

/**
 * Base interface for adapter request options.
 * Can be extended with additional properties by specific adapters.
 */
export interface AdapterOptions extends Record<string, any> {}

/**
 * Interface for adapter responses.
 * Contains the response data from the API.
 */
export interface AdapterResponse {
  /** The response data from the API */
  data: any;
}

/**
 * HTTP method constants for use in requests.
 * Provides type-safe HTTP method names.
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

/** Type representing valid HTTP method names */
export type MethodType = keyof typeof Methods;

/**
 * Configuration options for initializing Fluentity.
 * @property adapter - The adapter instance to use for API communication
 */
export interface FluentityOptions {
  /** The adapter instance to use for API communication */
  adapter: AdapterInterface;
}

/**
 * Main Fluentity class that manages API communication.
 * Implements the singleton pattern to ensure a single instance is used throughout the application.
 */
export class Fluentity {
  /** Singleton instance of Fluentity */
  private static instance: Fluentity;
  /** The adapter instance used for API communication */
  #adapter: AdapterInterface;

  /**
   * Creates a new Fluentity instance.
   * @param options - Configuration options for Fluentity
   */
  private constructor(options?: FluentityOptions) {
    if (Fluentity.instance) {
      throw new Error('Fluentity instance already exists. Use getInstance() instead.');
    }
    this.#adapter = options?.adapter ?? new DefaultClient();
    Fluentity.instance = this;
  }

  public get adapter() {
    return this.#adapter;
  }

  /**
   * Initializes the Fluentity singleton instance.
   * Must be called before using any other Fluentity functionality.
   * @param options - Configuration options for Fluentity
   * @returns The initialized Fluentity instance
   * @throws Error if Fluentity has already been initialized
   */
  public static initialize(options?: FluentityOptions): Fluentity {
    if (Fluentity.instance) {
      throw new Error('Fluentity has already been initialized. Use getInstance() instead.');
    }
    return new Fluentity(options);
  }

  /**
   * Gets the Fluentity singleton instance.
   * @returns The Fluentity instance
   * @throws Error if Fluentity has not been initialized
   */
  public static getInstance(): Fluentity {
    if (!Fluentity.instance) {
      throw new Error('Fluentity has not been initialized. Call initialize() first.');
    }
    return Fluentity.instance;
  }
}
