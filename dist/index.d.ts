declare class DefaultAdapter implements AdapterInterface {
    options: AdapterOptions;
    call(_queryBuilder: QueryBuilder): Promise<AdapterResponse>;
    configure(_options: Partial<AdapterOptions>): void;
}

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
interface AdapterInterface {
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
type AdapterOptions = Record<string, unknown>;
interface AdapterRequest {
}
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
type AdapterResponse<T = unknown | any> = {
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
declare const Methods: {
    /** HTTP GET method */
    readonly GET: "GET";
    /** HTTP POST method */
    readonly POST: "POST";
    /** HTTP PUT method */
    readonly PUT: "PUT";
    /** HTTP PATCH method */
    readonly PATCH: "PATCH";
    /** HTTP DELETE method */
    readonly DELETE: "DELETE";
    /** HTTP HEAD method */
    readonly HEAD: "HEAD";
    /** HTTP OPTIONS method */
    readonly OPTIONS: "OPTIONS";
};
/**
 * Type representing valid HTTP method names.
 * Derived from the Methods constant object.
 */
type MethodType = keyof typeof Methods;
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
interface FluentityOptions<A extends AdapterInterface = DefaultAdapter> {
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
declare class Fluentity<A extends AdapterInterface = DefaultAdapter> {
    #private;
    /**
     * Singleton instance of Fluentity.
     * @private
     * @static
     */
    private static instance;
    /**
     * Creates a new Fluentity instance.
     * Private constructor to enforce singleton pattern.
     *
     * @param {FluentityOptions<A>} [options] - Configuration options for Fluentity
     * @throws {Error} If a Fluentity instance already exists
     * @private
     */
    private constructor();
    /**
     * Gets the adapter instance used for API communication.
     *
     * @returns {A} The configured adapter instance
     * @public
     * @readonly
     */
    get adapter(): A;
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
    static initialize<A extends AdapterInterface = DefaultAdapter>(options?: FluentityOptions<A>): Fluentity<A>;
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
    static getInstance<A extends AdapterInterface = DefaultAdapter>(): Fluentity<A>;
    /**
     * Calls the adapter with the given query builder.
     * @param queryBuilder - The query builder to use
     * @returns The adapter response
     * @public
     */
    call(queryBuilder: QueryBuilder): Promise<AdapterResponse>;
    /**
     * Calls the adapter with the given query builder.
     * @param queryBuilder - The query builder to use
     * @returns The adapter response
     * @static
     */
    static call(queryBuilder: QueryBuilder): Promise<AdapterResponse>;
}

interface QueryBuilderOptions {
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
 * Provides methods for building and managing query parameters for API requests.
 * Used internally by models and relation builders to construct API calls.
 *
 * @example
 * ```typescript
 * const query = new QueryBuilder()
 *   .where({ status: 'active' })
 *   .orderBy('created_at', 'desc')
 *   .limit(10);
 * ```
 */
declare class QueryBuilder {
    constructor(options?: QueryBuilderOptions);
    /** The resource name for the API endpoint */
    resource?: string;
    /** Resource ID for single-resource operations */
    id?: string | number;
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
     *
     * @param where - Object containing field-value pairs to filter by
     * @returns The QueryBuilder instance for chaining
     * @example
     * ```typescript
     * query.where({ status: 'active', type: 'user' });
     * ```
     */
    where(where: Record<string, any>): this;
    /**
     * Adds filter conditions to the query.
     * Supports more complex filtering operations than where().
     *
     * @param filters - Object containing filter conditions
     * @returns The QueryBuilder instance for chaining
     * @example
     * ```typescript
     * query.filter({
     *   age: { gt: 18, lt: 65 },
     *   status: ['active', 'pending']
     * });
     * ```
     */
    filter(filters: Record<string, any>): this;
    /**
     * Resets the query builder to its initial state.
     * Clears all query parameters and options.
     *
     * @returns The QueryBuilder instance for chaining
     * @example
     * ```typescript
     * query.reset(); // Clear all query parameters
     * ```
     */
    reset(): this;
    /**
     * Converts the query builder to a plain object.
     * Used internally to construct the final query parameters.
     *
     * @returns A plain object containing all non-undefined query parameters
     * @example
     * ```typescript
     * const params = query.toObject();
     * // { query: { status: 'active' }, limit: 10 }
     * ```
     */
    toObject(): Record<string, any>;
}

/**
 * Builder class for has-many relationships between models.
 * Provides methods for managing a one-to-many relationship with another model.
 * Used when a model has multiple related model instances.
 *
 * @template T - The type of model this relation builder works with
 * @example
 * ```typescript
 * class User {
 *   @HasMany(() => Post)
 *   posts: Post[];
 * }
 * ```
 */
declare class HasManyRelationBuilder<T extends Model<Attributes>> extends RelationBuilder<T> {
    /**
     * Fetches all related model instances.
     * Makes a GET request to retrieve all related models.
     *
     * @returns A promise that resolves to an array of related model instances
     * @throws {Error} If the request fails
     * @example
     * ```typescript
     * const posts = await user.posts.all();
     * ```
     */
    all(): Promise<T[]>;
    /**
     * Creates a new related model instance.
     * Makes a POST request to create a new related model.
     *
     * @param data - The data to create the new model with
     * @returns A promise that resolves to the created model instance
     * @throws {Error} If the creation fails
     * @example
     * ```typescript
     * const post = await user.posts.create({
     *   title: 'New Post',
     *   content: 'Post content'
     * });
     * ```
     */
    create<A extends Partial<Attributes>>(data: A): Promise<T>;
    /**
     * Deletes a related model instance by ID.
     * Makes a DELETE request to remove a specific related model.
     *
     * @param id - The ID of the model to delete
     * @returns A promise that resolves when the deletion is complete
     * @throws {Error} If the deletion fails
     * @example
     * ```typescript
     * await user.posts.delete(123);
     * ```
     */
    delete(id: string | number): Promise<void>;
    /**
     * Updates a related model instance by ID.
     * Makes a PUT/PATCH request to update a specific related model.
     *
     * @param id - The ID of the model to update
     * @param data - The data to update the model with
     * @param method - The HTTP method to use (PUT or PATCH)
     * @returns A promise that resolves to the updated model instance
     * @throws {Error} If the update fails
     * @example
     * ```typescript
     * const post = await user.posts.update(123, {
     *   title: 'Updated Title',
     *   content: 'Updated content'
     * });
     * ```
     */
    update<A extends Partial<Attributes>>(id: string | number, data: A, method?: MethodType): Promise<T>;
    /**
     * Fetches a paginated list of related model instances.
     * Makes a GET request with pagination parameters.
     *
     * @param page - The page number to fetch (default: 1)
     * @param perPage - The number of items per page (default: 10)
     * @returns A promise that resolves to an array of related model instances
     * @throws {Error} If the request fails
     * @example
     * ```typescript
     * const posts = await user.posts.paginate(2, 20); // Get posts 21-40
     * ```
     */
    paginate(page?: number, perPage?: number): Promise<T[]>;
}

/**
 * Builder class for has-one relationships between models.
 * Provides methods for managing a one-to-one relationship with another model.
 * Used when a model has exactly one related model instance.
 *
 * @template T - The type of model this relation builder works with
 * @example
 * ```typescript
 * class User {
 *   @HasOne(() => Profile)
 *   profile: Profile;
 * }
 * ```
 */
declare class HasOneRelationBuilder<T extends Model<Attributes>> extends RelationBuilder<T> {
    /**
     * Fetches the related model instance.
     * Makes a GET request to retrieve the single related model.
     *
     * @returns A promise that resolves to the related model instance
     * @throws {Error} If the related model is not found
     * @example
     * ```typescript
     * const profile = await user.profile.get();
     * ```
     */
    get(): Promise<T>;
    /**
     * Updates the related model instance.
     * Makes a PUT/PATCH request to update the single related model.
     *
     * @param data - The data to update the related model with
     * @param method - The HTTP method to use (PUT or PATCH)
     * @returns A promise that resolves to the updated model instance
     * @throws {Error} If the update fails
     * @example
     * ```typescript
     * const profile = await user.profile.update({
     *   bio: 'New bio',
     *   location: 'New York'
     * });
     * ```
     */
    update<A extends Partial<Attributes>>(data: A, method?: MethodType): Promise<T>;
    /**
     * Deletes the related model instance.
     * Makes a DELETE request to remove the single related model.
     *
     * @returns A promise that resolves when the deletion is complete
     * @throws {Error} If the deletion fails
     * @example
     * ```typescript
     * await user.profile.delete();
     * ```
     */
    delete(): Promise<void>;
}

/**
 * Type that determines the appropriate relation builder based on the model type.
 * Maps model types to their corresponding relation builder types:
 * - Single model -> HasOneRelationBuilder
 * - Array of models -> HasManyRelationBuilder
 *
 * @template T - The model type to determine the relation builder for
 * @example
 * ```typescript
 * type UserRelation = Relation<User>; // HasOneRelationBuilder<User>
 * type UsersRelation = Relation<User[]>; // HasManyRelationBuilder<User>
 * ```
 */
type Relation<T> = T extends Model<Attributes> ? HasOneRelationBuilder<T> : T extends Array<Model<Attributes>> ? HasManyRelationBuilder<T[number]> : never;
/**
 * Base class for building and managing relationships between models.
 * Provides methods for querying related models and building API requests.
 * This class is extended by HasOneRelationBuilder and HasManyRelationBuilder
 * to implement specific relationship behaviors.
 *
 * @template T - The type of model this relation builder works with
 * @example
 * ```typescript
 * class UserPosts extends RelationBuilder<Post> {
 *   // Custom relationship logic
 * }
 * ```
 */
declare class RelationBuilder<T extends Model<Attributes>> {
    /**
     * Query builder instance for constructing API URLs and managing query parameters.
     * Used internally to build the request URL and parameters.
     */
    queryBuilder: QueryBuilder;
    /**
     * The related model instance that this builder operates on.
     * Used to create new instances of the related model.
     * @protected
     */
    protected relatedModel: T;
    /**
     * Creates a new relation builder instance.
     * Sets up the query builder and configures the resource path.
     *
     * @param model - The model instance to build relations for
     * @param queryBuilder - Query builder instance for constructing API requests
     * @param resource - Optional custom resource name for the relation
     * @throws {Error} If the model or query builder is invalid
     */
    constructor(model: T, queryBuilder: QueryBuilder, resource?: string);
    /**
     * Type definition for dynamic scope methods that can be added at runtime.
     * Allows for custom query scopes to be added to the builder.
     */
    [key: string]: any;
    /**
     * Gets the Fluentity instance for making API requests.
     * Provides access to the singleton instance that manages API communication.
     *
     * @protected
     * @returns The singleton Fluentity instance
     * @throws {Error} If Fluentity has not been initialized
     */
    protected get fluentity(): Fluentity<DefaultAdapter>;
    /**
     * Gets a model instance by ID without making an API request.
     * Creates a new model instance with the given ID for local operations.
     *
     * @param id - The ID of the model to get
     * @returns A new model instance with the given ID
     * @example
     * ```typescript
     * const post = user.posts.id(123);
     * ```
     */
    id(id: string | number): T;
    /**
     * Fetches a model instance by ID from the API.
     * Makes a GET request to retrieve the model data.
     *
     * @param id - The ID of the model to fetch
     * @returns A promise that resolves to the fetched model instance
     * @throws {Error} If the model is not found
     * @example
     * ```typescript
     * const post = await user.posts.find(123);
     * ```
     */
    find(id: string | number): Promise<T>;
    /**
     * Adds a where clause to the query.
     * Filters results based on exact field-value matches.
     *
     * @param where - Object containing field-value pairs to filter by
     * @returns The relation builder instance for chaining
     * @example
     * ```typescript
     * const posts = await user.posts.where({ published: true }).all();
     * ```
     */
    where(where: Record<string, any>): RelationBuilder<T>;
    /**
     * Adds filter conditions to the query.
     * Supports more complex filtering operations than where().
     *
     * @param filters - Object containing filter conditions
     * @returns The relation builder instance for chaining
     * @example
     * ```typescript
     * const posts = await user.posts.filter({
     *   created_at: { gt: '2023-01-01' },
     *   status: ['published', 'draft']
     * }).all();
     * ```
     */
    filter(filters: Record<string, any>): RelationBuilder<T>;
    /**
     * Adds an order by clause to the query.
     * Sorts the results by the specified field and direction.
     *
     * @param sort - The field to order by (default: 'id')
     * @param direction - The direction to order in ('asc' or 'desc', default: 'asc')
     * @returns The relation builder instance for chaining
     * @example
     * ```typescript
     * const posts = await user.posts.orderBy('created_at', 'desc').all();
     * ```
     */
    orderBy(sort?: string, direction?: string): RelationBuilder<T>;
    /**
     * Limits the number of results returned.
     * Restricts the query to return at most n results.
     *
     * @param n - The maximum number of results to return
     * @returns The relation builder instance for chaining
     * @example
     * ```typescript
     * const posts = await user.posts.limit(10).all();
     * ```
     */
    limit(n: number): RelationBuilder<T>;
    /**
     * Sets the offset for pagination in the query results.
     * Skips n records before starting to return results.
     *
     * @param n - The number of records to skip
     * @returns The relation builder instance for chaining
     * @example
     * ```typescript
     * const posts = await user.posts.offset(20).limit(10).all(); // Get posts 21-30
     * ```
     */
    offset(n: number): RelationBuilder<T>;
}

/**
 * Type representing a constructor function that creates instances of type T.
 * Used for type-safe instantiation of model classes.
 *
 * @template T - The type that the constructor creates
 * @example
 * ```typescript
 * const UserConstructor: Constructor<User> = User;
 * const user = new UserConstructor();
 * ```
 */
type Constructor<T = any> = new (...args: any[]) => T;
/**
 * Type for property decorator functions.
 * Defines the signature for decorators that modify class properties.
 *
 * @example
 * ```typescript
 * const decorator: PropertyDecoratorType = (target, key) => {
 *   // Modify the property
 * };
 * ```
 */
type PropertyDecoratorType = (target: object, key: string | symbol) => void;
/**
 * Decorator for casting property values to model instances.
 * Automatically converts plain objects to model instances when accessed.
 *
 * @param caster - Factory function that returns the model constructor to cast to
 * @returns A property decorator function
 * @example
 * ```typescript
 * class User {
 *   @Cast(() => Profile)
 *   profile: Profile;
 * }
 * ```
 */
declare const Cast: <T extends Model<Attributes>>(caster: () => Constructor<T>) => PropertyDecoratorType;
/**
 * Decorator for creating a has-one relationship between models.
 * Sets up a one-to-one relationship where a model has exactly one related model.
 *
 * @param model - Factory function that returns the related model constructor
 * @param resource - Optional custom resource name for the relation
 * @returns A property decorator function
 * @example
 * ```typescript
 * class User {
 *   @HasOne(() => Profile)
 *   profile: Profile;
 * }
 * ```
 */
declare const HasOne: (model: () => Constructor<Model<Attributes>>, resource?: string) => PropertyDecoratorType;
/**
 * Decorator for creating a has-many relationship between models.
 * Sets up a one-to-many relationship where a model has multiple related models.
 *
 * @param model - Factory function that returns the related model constructor
 * @param resource - Optional custom resource name for the relation
 * @returns A property decorator function
 * @example
 * ```typescript
 * class User {
 *   @HasMany(() => Post)
 *   posts: Post[];
 * }
 * ```
 */
declare const HasMany: (model: () => Constructor<Model<Attributes>>, resource?: string) => PropertyDecoratorType;
/**
 * Alias for HasOne decorator.
 * Used for better semantic meaning in certain relationship contexts.
 *
 * @example
 * ```typescript
 * class Post {
 *   @BelongsTo(() => User)
 *   author: User;
 * }
 * ```
 */
declare const BelongsTo: (model: () => Constructor<Model<Attributes>>, resource?: string) => PropertyDecoratorType;
/**
 * Alias for HasMany decorator.
 * Used for better semantic meaning in certain relationship contexts.
 *
 * @example
 * ```typescript
 * class User {
 *   @BelongsToMany(() => Role)
 *   roles: Role[];
 * }
 * ```
 */
declare const BelongsToMany: (model: () => Constructor<Model<Attributes>>, resource?: string) => PropertyDecoratorType;

/**
 * Base interface for model attributes that all models must implement.
 * Provides the basic structure for model data and allows for dynamic properties.
 * @interface
 */
interface Attributes {
    /** Unique identifier for the model instance. Can be either a string or number. */
    id?: string | number;
    /** Index signature allowing for dynamic properties of any type */
    [key: string]: any;
}
/**
 * Base class for all models in the ORM.
 * Provides core functionality for interacting with the API and managing model data.
 * Handles CRUD operations, relationships, and query building.
 *
 * @template T - The type of attributes this model will have, must extend Attributes
 * @example
 * ```typescript
 * class User extends Model<UserAttributes> {
 *   static resource = 'users';
 * }
 * ```
 */
declare class Model<T extends Attributes = Attributes> {
    #private;
    /**
     * Custom query scopes that can be applied to model queries.
     * Each scope is a function that modifies the query builder behavior.
     * @static
     */
    static scopes?: Record<string, (query: RelationBuilder<any>) => RelationBuilder<any>>;
    /**
     * Unique identifier for the model instance.
     * Can be either a string or number, depending on the API's ID format.
     */
    id?: string | number;
    /**
     * Index signature for dynamic properties.
     * Allows models to have additional properties beyond their defined attributes.
     */
    [key: string]: any;
    /**
     * Resource endpoint for the model, used to construct API URLs.
     * Must be set by subclasses to define the API endpoint.
     * @static
     * @example
     * ```typescript
     * static resource = 'users';
     * ```
     */
    static resource: string;
    /**
     * Creates a new model instance with the given attributes.
     * Initializes the query builder and sets up the model's state.
     *
     * @param attributes - The attributes to initialize the model with
     * @param queryBuilder - Optional query builder instance to use instead of creating a new one
     * @returns A new model instance
     * @throws {Error} If required attributes are missing
     */
    constructor(attributes: T, queryBuilder?: QueryBuilder);
    /**
     * Gets the query builder instance for this model.
     * Used internally for constructing API requests.
     * @returns The query builder instance
     * @protected
     */
    get queryBuilder(): QueryBuilder;
    /**
     * Gets the Fluentity instance for making API requests.
     * Provides access to the singleton instance that manages API communication.
     *
     * @protected
     * @returns The singleton Fluentity instance
     * @throws {Error} If Fluentity has not been initialized
     */
    protected get fluentity(): Fluentity<DefaultAdapter>;
    /**
     * Gets or creates a relation builder for the given model class.
     * Uses an internal cache to avoid creating duplicate relation builders.
     *
     * @param model - The model class to create a relation builder for
     * @param relationBuilderFactory - The factory class to create the relation builder
     * @returns A relation builder instance configured for the model
     * @private
     * @static
     */
    private static getRelationBuilder;
    /**
     * Creates a new model instance with the given ID.
     * Useful for creating model instances when only the ID is known.
     *
     * @param id - The ID to assign to the new model instance
     * @returns A new model instance with the specified ID
     * @static
     * @example
     * ```typescript
     * const user = User.id(123);
     * ```
     */
    static id<T extends Model<Attributes>>(this: Constructor<T>, id: string | number): T;
    /**
     * Starts a new query builder for the model.
     * Returns a HasManyRelationBuilder for querying multiple records.
     *
     * @returns A HasManyRelationBuilder instance for building queries
     * @static
     * @example
     * ```typescript
     * const users = await User.query().where({ active: true }).all();
     * ```
     */
    static query<T extends Model<Attributes>>(this: Constructor<T>): HasManyRelationBuilder<T>;
    /**
     * Starts a query with a where clause.
     * Shorthand for query().where() for common filtering operations.
     *
     * @param where - Conditions to filter by, as field-value pairs
     * @returns A HasManyRelationBuilder instance with where conditions applied
     * @static
     * @example
     * ```typescript
     * const activeUsers = await User.where({ active: true }).all();
     * ```
     */
    static where<T extends Model<Attributes>>(this: Constructor<T>, where: Partial<Attributes>): HasManyRelationBuilder<T>;
    /**
     * Starts a query with filter conditions.
     * Similar to where() but specifically for filter operations.
     *
     * @param filters - Filter conditions to apply, as field-value pairs
     * @returns A HasManyRelationBuilder instance with filters applied
     * @static
     * @example
     * ```typescript
     * const users = await User.filter({ age: { gt: 18 } }).all();
     * ```
     */
    static filter<T extends Model<Attributes>>(this: Constructor<T>, filters: Record<string, any>): HasManyRelationBuilder<T>;
    /**
     * Retrieves all records for the model.
     * Fetches all records from the API without any filtering.
     *
     * @returns Promise resolving to an array of model instances
     * @static
     * @example
     * ```typescript
     * const allUsers = await User.all();
     * ```
     */
    static all<T extends Model<Attributes>>(this: Constructor<T>): Promise<T[]>;
    /**
     * Finds a single record by ID.
     * Fetches a specific record from the API by its ID.
     *
     * @param id - The ID of the record to find
     * @returns Promise resolving to a model instance
     * @throws {Error} If the record is not found
     * @static
     * @example
     * ```typescript
     * const user = await User.find(123);
     * ```
     */
    static find<T extends Model<Attributes>>(this: Constructor<T>, id: string | number): Promise<T>;
    /**
     * Creates a new record.
     * Sends a POST request to create a new record in the API.
     *
     * @param data - The data to create the record with
     * @returns Promise resolving to the created model instance
     * @throws {Error} If the creation fails
     * @static
     * @example
     * ```typescript
     * const user = await User.create({ name: 'John', email: 'john@example.com' });
     * ```
     */
    static create<A extends Partial<Attributes>, T extends Model<Attributes>>(this: Constructor<T>, data: A): Promise<T>;
    /**
     * Updates an existing record.
     * Sends a PUT/PATCH request to update a record in the API.
     *
     * @param id - The ID of the record to update
     * @param data - The data to update the record with
     * @param method - The HTTP method to use for the update (PUT or PATCH)
     * @returns Promise resolving to the updated model instance
     * @throws {Error} If the update fails
     * @static
     * @example
     * ```typescript
     * const user = await User.update(123, { name: 'John Doe' });
     * ```
     */
    static update<A extends Partial<Attributes>, T extends Model<Attributes>>(this: Constructor<T>, id: string | number, data: A, method?: MethodType): Promise<T>;
    /**
     * Deletes a record by ID.
     * Sends a DELETE request to remove a record from the API.
     *
     * @param id - The ID of the record to delete
     * @returns Promise that resolves when the deletion is complete
     * @throws {Error} If the deletion fails
     * @static
     * @example
     * ```typescript
     * await User.delete(123);
     * ```
     */
    static delete<T extends Model<Attributes>>(this: Constructor<T>, id: string | number): Promise<void>;
    /**
     * Retrieves the current model instance from the server.
     * Updates the local instance with fresh data from the API.
     *
     * @returns Promise resolving to the updated model instance
     * @throws {Error} If the record is not found
     * @example
     * ```typescript
     * await user.get(); // Refreshes user data from the server
     * ```
     */
    get(): Promise<this>;
    /**
     * Saves the current model instance to the server.
     * Creates a new record if the model doesn't have an ID, updates existing record otherwise.
     *
     * @returns Promise resolving to the saved model instance
     * @throws {Error} If the save operation fails
     * @example
     * ```typescript
     * user.name = 'John Doe';
     * await user.save(); // Creates or updates the user
     * ```
     */
    save(): Promise<this>;
    /**
     * Updates the model instance with new attributes and saves to the server.
     *
     * @param attributes - Optional attributes to update before saving
     * @param method - The HTTP method to use for the update (PUT or PATCH)
     * @returns Promise resolving to the updated model instance
     * @throws {Error} If the update fails
     * @example
     * ```typescript
     * await user.update({ name: 'John Doe' });
     * ```
     */
    update(attributes?: Partial<T>, method?: MethodType): Promise<this>;
    /**
     * Deletes the model instance from the server.
     *
     * @returns Promise that resolves when the deletion is complete
     * @throws {Error} If the deletion fails
     * @example
     * ```typescript
     * await user.delete();
     * ```
     */
    delete(): Promise<void>;
    /**
     * Calls the adapter with the given query builder.
     * @param queryBuilder - The query builder to use
     * @returns The adapter response
     * @protected
     */
    protected call(queryBuilder: QueryBuilder): Promise<AdapterResponse<T>>;
    static call(queryBuilder: QueryBuilder): Promise<AdapterResponse>;
    /**
     * Converts the model instance to a plain object.
     * Recursively converts nested model instances to plain objects.
     *
     * @returns A plain object representation of the model's attributes
     * @example
     * ```typescript
     * const userData = user.toObject();
     * ```
     */
    toObject(): Record<string, any>;
}

/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
declare abstract class HttpAdapter implements AdapterInterface {
    protected _cache: WeakMap<HttpRequest, CacheData>;
    protected _url: string;
    options: HttpAdapterOptions;
    /**
     * Constructor for the RestAdapter class.
     * @param options - Partial configuration options to merge with existing options
     */
    constructor(options: Partial<HttpAdapterOptions>);
    configure(options: Partial<HttpAdapterOptions>): this;
    get url(): string;
    /**
     * Clears all cached responses.
     */
    clearCache(): this;
    /**
     * Makes an HTTP request to the specified URL with optional request options.
     * Handles caching, interceptors, and error handling.
     * @param url - The endpoint URL to call (will be appended to baseUrl)
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
interface HttpAdapterOptions<T = unknown | any> extends AdapterOptions {
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
interface CacheOptions {
    /** Whether caching is enabled */
    enabled: boolean;
    /** Time-to-live for cached responses in milliseconds */
    ttl?: number;
}
interface HttpRequestInterface {
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
declare class HttpRequest implements HttpRequestInterface, AdapterRequest {
    /** The full URL to send the request to */
    url: string;
    options?: HttpRequestOptions;
    method?: MethodType;
    body?: string;
    constructor(options?: Partial<HttpRequestInterface>);
}
interface HttpResponseInterface<T = unknown> {
    data: T;
}
declare class HttpResponse<T = unknown> implements HttpResponseInterface<T>, AdapterResponse<T> {
    data: T;
    constructor(options?: Partial<HttpResponseInterface>);
}
/**
 * Configuration options for HTTP requests.
 * Extends the standard Fetch API RequestInit interface with additional options.
 */
interface HttpRequestOptions extends AdapterOptions {
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
    data: HttpResponse;
    /** Timestamp when the data was cached (milliseconds since epoch) */
    timestamp: number;
}

/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
declare class RestAdapter extends HttpAdapter {
    /**
     * Constructor for the RestAdapter class.
     * @param options - Partial configuration options to merge with existing options
     */
    constructor(options: Partial<RestAdapterOptions>);
    /**
     * Builds the final URL for the API request.
     * @returns The constructed URL with query parameters
     */
    protected buildUrl(queryBuilder: QueryBuilder): string;
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
 * Configuration options for the HttpClient.
 */
type RestAdapterOptions = HttpAdapterOptions;

export { type AdapterInterface, type AdapterOptions, type AdapterRequest, type AdapterResponse, type Attributes, BelongsTo, BelongsToMany, Cast, type Constructor, DefaultAdapter, Fluentity, type FluentityOptions, HasMany, HasOne, type MethodType, Methods, Model, type PropertyDecoratorType, QueryBuilder, type Relation, RelationBuilder, RestAdapter, type RestAdapterOptions };
