/**
 * Builder class for constructing URL query strings.
 * Provides methods for building and managing query parameters for API requests.
 */
declare class URLQueryBuilder {
    /** The base path for the URL */
    private _path;
    /** The query parameters to include in the URL */
    private _query;
    private _includes;
    private _sort;
    private _limit?;
    private _offset?;
    private _page?;
    private _perPage?;
    private _id?;
    /**
     * Sets the base path for the URL.
     * @param path - The path to set
     * @returns The URLQueryBuilder instance for chaining
     */
    path(path: string): this;
    /**
     * Adds an ID parameter to the query.
     * @param id - The ID to add
     * @returns The URLQueryBuilder instance for chaining
     */
    id(id: string | number): this;
    /**
     * Adds where conditions to the query.
     * @param where - Object containing field-value pairs to filter by
     * @returns The URLQueryBuilder instance for chaining
     */
    where(where: Record<string, any>): this;
    /**
     * Adds filter conditions to the query.
     * @param filters - Object containing filter conditions
     * @returns The URLQueryBuilder instance for chaining
     */
    filter(filters: Record<string, any>): this;
    /**
     * Adds relations to include in the query.
     * @param relations - Single relation name or array of relation names to include
     * @returns The URLQueryBuilder instance for chaining
     */
    include(relations: string | string[]): this;
    /**
     * Adds an order by clause to the query.
     * @param field - The field to order by
     * @param dir - The direction to order in ('asc' or 'desc')
     * @returns The URLQueryBuilder instance for chaining
     */
    orderBy(field: string, dir?: string): this;
    /**
     * Sets the page number for pagination.
     * @param page - The page number
     * @returns The URLQueryBuilder instance for chaining
     */
    page(page: number): this;
    /**
     * Sets the number of items per page for pagination.
     * @param perPage - The number of items per page
     * @returns The URLQueryBuilder instance for chaining
     */
    perPage(perPage: number): this;
    /**
     * Sets the offset for pagination.
     * @param offset - The offset value
     * @returns The URLQueryBuilder instance for chaining
     */
    offset(offset: number): this;
    /**
     * Sets the limit for the number of results.
     * @param limit - The maximum number of results
     * @returns The URLQueryBuilder instance for chaining
     */
    limit(limit: number): this;
    /**
     * Resets the query builder to its initial state.
     * @returns The URLQueryBuilder instance for chaining
     */
    reset(): this;
    /**
     * Builds the final URL with all query parameters.
     * @returns The constructed URL string
     */
    toUrl(): string;
    toQueryString(): string;
}

/**
 * Builder class for has-many relationships between models.
 * Provides methods for managing a one-to-many relationship with another model.
 * @template T - The type of model this relation builder works with
 */
declare class HasManyRelationBuilder<T extends Model<any>> extends RelationBuilder<T> {
    /**
     * Fetches all related model instances.
     * @returns A promise that resolves to an array of related model instances
     */
    all(): Promise<T[]>;
    /**
     * Creates a new related model instance.
     * @param data - The data to create the new model with
     * @returns A promise that resolves to the created model instance
     */
    create<A extends Partial<Attributes>>(data: A): Promise<T>;
    /**
     * Deletes a related model instance by ID.
     * @param id - The ID of the model to delete
     * @returns A promise that resolves when the deletion is complete
     */
    delete(id: string | number): Promise<void>;
    /**
     * Updates a related model instance by ID.
     * @param id - The ID of the model to update
     * @param data - The data to update the model with
     * @returns A promise that resolves to the updated model instance
     */
    update<A extends Partial<Attributes>>(id: string | number, data: A): Promise<T>;
    /**
     * Fetches a paginated list of related model instances.
     * @param page - The page number to fetch (default: 1)
     * @param perPage - The number of items per page (default: 10)
     * @returns A promise that resolves to an array of related model instances
     */
    paginate(page?: number, perPage?: number): Promise<T[]>;
}

/**
 * Builder class for has-one relationships between models.
 * Provides methods for managing a one-to-one relationship with another model.
 * @template T - The type of model this relation builder works with
 */
declare class HasOneRelationBuilder<T extends Model<any>> extends RelationBuilder<T> {
    /**
     * Fetches the related model instance.
     * @returns A promise that resolves to the related model instance
     */
    get(): Promise<T>;
    /**
     * Updates the related model instance.
     * @param data - The data to update the related model with
     * @returns A promise that resolves to the updated model instance
     */
    update<A extends Partial<Attributes>>(data: A): Promise<T>;
    /**
     * Deletes the related model instance.
     * @returns A promise that resolves when the deletion is complete
     */
    delete(): Promise<void>;
}

/**
 * Type that determines the appropriate relation builder based on the model type.
 * @template T - The model type to determine the relation builder for
 */
type Relation<T> = T extends Model<any> ? HasOneRelationBuilder<T> : T extends Array<Model<any>> ? HasManyRelationBuilder<T[number]> : never;
/**
 * Base class for building and managing relationships between models.
 * Provides methods for querying related models and building API requests.
 * @template T - The type of model this relation builder works with
 */
declare class RelationBuilder<T extends Model<any>> {
    /** Query builder instance for constructing API URLs */
    protected queryBuilder: URLQueryBuilder;
    /** The related model instance */
    protected relatedModel: T;
    /** The API path for this relation */
    protected path: string;
    /**
     * Creates a new relation builder instance.
     * @param model - Factory function that returns a model instance
     * @param urlQueryBuilder - Optional query builder instance
     * @param initialPath - Optional initial path for the relation
     */
    constructor(model: () => Model<any>, urlQueryBuilder?: URLQueryBuilder, initialPath?: string);
    [key: string]: any;
    /**
     * Gets a model instance by ID without making an API request.
     * @param id - The ID of the model to get
     * @returns A new model instance with the given ID
     */
    id(id: string | number): T;
    /**
     * Fetches a model instance by ID from the API.
     * @param id - The ID of the model to fetch
     * @returns A promise that resolves to the fetched model instance
     */
    find(id: string | number): Promise<T>;
    /**
     * Adds a where clause to the query.
     * @param where - Object containing field-value pairs to filter by
     * @returns The relation builder instance for chaining
     */
    where(where: Record<string, any>): RelationBuilder<T>;
    /**
     * Adds filter conditions to the query.
     * @param filters - Object containing filter conditions
     * @returns The relation builder instance for chaining
     */
    filter(filters: Record<string, any>): RelationBuilder<T>;
    /**
     * Specifies relations to include in the response.
     * @param relations - Single relation name or array of relation names to include
     * @returns The relation builder instance for chaining
     */
    include(relations: string | string[]): RelationBuilder<T>;
    /**
     * Adds an order by clause to the query.
     * @param field - The field to order by
     * @param dir - The direction to order in ('asc' or 'desc')
     * @returns The relation builder instance for chaining
     */
    orderBy(field: string, dir?: string): RelationBuilder<T>;
    /**
     * Limits the number of results returned.
     * @param n - The maximum number of results to return
     * @returns The relation builder instance for chaining
     */
    limit(n: number): RelationBuilder<T>;
    offset(n: number): RelationBuilder<T>;
    /**
     * Builds the final URL for the API request.
     * @returns The constructed URL with query parameters
     */
    protected buildUrl(): string;
}

/**
 * Type representing a constructor function that creates instances of type T.
 * @template T - The type that the constructor creates
 */
type Constructor<T = any> = new (...args: any[]) => T;
/**
 * Type for property decorator functions.
 */
type PropertyDecoratorType = (target: Object, key: string | symbol) => void;
declare const Cast: (caster: () => Constructor<any>) => PropertyDecoratorType;
/**
 * Decorator for creating a has-one relationship between models.
 * @param model - Factory function that returns the related model constructor
 * @param resource - Optional custom resource name for the relation
 * @returns A property decorator function
 */
declare const HasOne: (model: () => Constructor<Model<any>>, resource?: string) => PropertyDecoratorType;
/**
 * Decorator for creating a has-many relationship between models.
 * @param model - Factory function that returns the related model constructor
 * @param resource - Optional custom resource name for the relation
 * @returns A property decorator function
 */
declare const HasMany: (model: () => Constructor<Model<any>>, resource?: string) => PropertyDecoratorType;
declare const BelongsTo: (model: () => Constructor<Model<any>>, resource?: string) => PropertyDecoratorType;
declare const BelongsToMany: (model: () => Constructor<Model<any>>, resource?: string) => PropertyDecoratorType;

/**
 * Base interface for model attributes that all models must implement.
 * Provides the basic structure for model data.
 */
interface Attributes {
    /** Unique identifier for the model instance */
    id?: string | number;
    [key: string]: any;
}
/**
 * Base class for all models in the ORM.
 * Provides core functionality for interacting with the API and managing model data.
 * @template T - The type of attributes this model will have
 */
declare class Model<T extends Attributes = Attributes> {
    #private;
    /** Custom query scopes that can be applied to model queries */
    static scopes?: Record<string, (query: RelationBuilder<any>) => RelationBuilder<any>>;
    /** Unique identifier for the model instance */
    id?: string | number;
    [key: string]: any;
    /** Resource endpoint for the model */
    static resource: string;
    /** Cache for relation builders to prevent unnecessary instantiation */
    private static _relationCache;
    /**
     * Creates a new model instance with the given attributes.
     * @param attributes - The attributes to initialize the model with
     * @returns A new model instance
     */
    constructor(attributes: T);
    /**
     * Gets the current path for the model instance.
     * The path represents the API endpoint for this model.
     */
    get path(): string;
    /**
     * Sets the path for the model instance.
     * @param path - New path value to set
     */
    set path(path: string);
    /**
     * Gets or creates a relation builder for the given model class.
     * Uses an internal cache to avoid creating duplicate relation builders.
     * @param modelClass - The model class to create a relation builder for
     * @param relationBuilderFactory - The factory class to create the relation builder
     * @returns A relation builder instance
     */
    private static getRelationBuilder;
    /**
     * Creates a new model instance with the given ID.
     * @param id - The ID to assign to the new model instance
     * @returns A new model instance with the specified ID
     */
    static id<T extends Model<any>>(this: Constructor<T>, id: string | number): T;
    /**
     * Starts a new query builder for the model
     * @returns A HasManyRelationBuilder instance
     */
    static query<T extends Model<Attributes>>(this: Constructor<T>): HasManyRelationBuilder<T>;
    /**
     * Starts a query with a where clause
     * @param where - Conditions to filter by
     * @returns A HasManyRelationBuilder instance with where conditions applied
     */
    static where<T extends Model<Attributes>>(this: Constructor<T>, where: Partial<Attributes>): HasManyRelationBuilder<T>;
    /**
     * Starts a query with filter conditions
     * @param filters - Filter conditions to apply
     * @returns A HasManyRelationBuilder instance with filters applied
     */
    static filter<T extends Model<Attributes>>(this: Constructor<T>, filters: Record<string, any>): HasManyRelationBuilder<T>;
    /**
     * Starts a query with relations to include
     * @param relations - Single relation or array of relations to include
     * @returns A HasManyRelationBuilder instance with relations included
     */
    static include<T extends Model<Attributes>>(this: Constructor<T>, relations: string | string[]): HasManyRelationBuilder<T>;
    /**
     * Retrieves all records for the model
     * @returns Promise resolving to an array of model instances
     */
    static all<T extends Model<Attributes>>(this: Constructor<T>): Promise<T[]>;
    /**
     * Finds a single record by ID
     * @param id - The ID to find
     * @returns Promise resolving to a model instance
     */
    static find<T extends Model<Attributes>>(this: Constructor<T>, id: string | number): Promise<T>;
    /**
     * Creates a new record
     * @param data - The data to create the record with
     * @returns Promise resolving to the created model instance
     */
    static create<A extends Partial<Attributes>, T extends Model<Attributes>>(this: Constructor<T>, data: A): Promise<T>;
    /**
     * Updates an existing record
     * @param id - The ID of the record to update
     * @param data - The data to update the record with
     * @returns Promise resolving to the updated model instance
     */
    static update<A extends Partial<Attributes>, T extends Model<Attributes>>(this: Constructor<T>, id: string | number, data: A): Promise<T>;
    /**
     * Deletes a record by ID
     * @param id - The ID of the record to delete
     * @returns Promise that resolves when the deletion is complete
     */
    static delete<T extends Model<Attributes>>(this: Constructor<T>, id: string | number): Promise<void>;
    /**
     * Retrieves the current model instance from the server
     * @returns Promise resolving to the updated model instance
     */
    get(): Promise<this>;
    /**
     * Saves the current model instance to the API.
     * Creates a new record if the model has no ID, updates existing record otherwise.
     * @returns A promise that resolves to the saved model instance
     */
    save(): Promise<this>;
    /**
     * Updates the current model instance with new attributes.
     * @param attributes - The attributes to update
     * @returns A promise that resolves to the updated model instance
     */
    update(attributes?: Partial<T>): Promise<this>;
    /**
     * Deletes the current model instance from the API.
     * @returns A promise that resolves when the deletion is complete
     * @throws Error if the model has no ID
     */
    delete(): Promise<void>;
    /**
     * Converts the model instance to a plain object
     * Handles nested model instances and arrays of models
     * @returns A plain object representation of the model
     */
    toObject(): Record<string, any>;
}

/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
declare class HttpClient {
    #private;
    static options: HttpClientOptions;
    /**
     * Configures the HTTP client with custom options.
     * @param opts - Partial configuration options to merge with existing options
     */
    static configure(opts: Partial<HttpClientOptions>): void;
    /**
     * Removes a specific URL from the cache.
     * @param url - The URL to remove from the cache
     */
    static deleteCache(url: string): void;
    /**
     * Clears all cached responses.
     */
    static clearCache(): void;
    /**
     * Gets the current cache map containing all cached responses.
     * @returns The cache map
     */
    static get cache(): Map<string, CacheData>;
    /**
     * Retrieves cached data for a specific URL.
     * @param url - The URL to get cached data for
     * @returns The cached data if it exists
     */
    static getCache<T = any>(url: string): CacheData;
    /**
     * Gets the last URL that was called.
     * @returns The last called URL
     */
    static get url(): string;
    /**
     * Makes an HTTP request to the specified URL with optional request options.
     * Handles caching, interceptors, and error handling.
     * @param url - The endpoint URL to call (will be appended to baseUrl)
     * @param options - Optional request configuration
     * @returns A promise that resolves to the response data
     * @throws Error if baseUrl is not configured or if the request fails
     */
    static call<T = any>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>;
}
/**
 * Default request handler that uses the Fetch API to make HTTP requests.
 * @param request - The HTTP request configuration
 * @returns A promise that resolves to the JSON response
 * @throws Error if the request fails
 */
declare function fetchRequestHandler(request: HttpRequest): Promise<HttpResponse>;
/**
 * HTTP method constants for use in requests.
 */
declare const Methods: {
    readonly GET: "GET";
    readonly POST: "POST";
    readonly PUT: "PUT";
    readonly PATCH: "PATCH";
    readonly DELETE: "DELETE";
    readonly HEAD: "HEAD";
    readonly OPTIONS: "OPTIONS";
};
type MethodType = keyof typeof Methods;
/**
 * Configuration options for the HttpClient.
 */
interface HttpClientOptions {
    /** Base URL to prepend to all requests */
    baseUrl?: string;
    /** Default request options to apply to all requests */
    options?: RequestOptions;
    /** Interceptor to modify requests before they are sent */
    requestInterceptor?: (request: HttpRequest) => HttpRequest;
    /** Interceptor to modify responses after they are received */
    responseInterceptor?: (response: HttpResponse) => HttpResponse;
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
interface CacheOptions {
    /** Whether caching is enabled */
    enabled: boolean;
    /** Time-to-live for cached responses in milliseconds */
    ttl?: number;
}
/**
 * Represents an HTTP request configuration.
 */
interface HttpRequest {
    /** The full URL to send the request to */
    url: string;
    /** Request options including method, headers, body, etc. */
    options: RequestOptions;
}
/**
 * Represents an HTTP response, which can be a single item or an array.
 */
type HttpResponse<T = any> = T | T[];
/**
 * Configuration options for HTTP requests.
 * Extends the standard Fetch API RequestInit interface with additional options.
 */
interface RequestOptions {
    /** Request body data */
    body?: any;
    /** HTTP method to use */
    method?: MethodType;
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
interface CacheData {
    /** The cached response data */
    data: any;
    /** Timestamp when the data was cached (milliseconds since epoch) */
    timestamp: number;
}

export { type Attributes, BelongsTo, BelongsToMany, Cast, type Constructor, HttpClient as FluORM, HasMany, HasOne, HttpClient, type HttpRequest, type HttpResponse, type MethodType, Methods, Model, type PropertyDecoratorType, type Relation, RelationBuilder, type RequestOptions, fetchRequestHandler };
