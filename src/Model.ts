import { RelationBuilder, HasOneRelationBuilder, HasManyRelationBuilder, Constructor, AdapterResponse, Fluentity, Methods, MethodType, RestAdapter } from './index';
import { QueryBuilder } from './QueryBuilder';

/**
 * Base interface for model attributes that all models must implement.
 * Provides the basic structure for model data and allows for dynamic properties.
 * All model attributes must extend this interface to ensure type safety.
 *
 * @interface
 * @example
 * ```typescript
 * interface UserAttributes extends Attributes {
 *   name: string;
 *   email: string;
 *   age?: number;
 *   // Dynamic properties are allowed
 *   [key: string]: any;
 * }
 * ```
 */
export interface Attributes {
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
 * Features:
 * - Automatic API request handling
 * - Relationship management
 * - Query building and filtering
 * - Data validation and transformation
 * - Dynamic property access
 *
 * @template T - The type of attributes this model will have, must extend Attributes
 * @example
 * ```typescript
 * // Basic model definition
 * class User extends Model<UserAttributes> {
 *   static resource = 'users';
 * }
 *
 * // Model with relationships
 * class Post extends Model<PostAttributes> {
 *   static resource = 'posts';
 *
 *   @HasOne(() => User)
 *   author: User;
 *
 *   @HasMany(() => Comment)
 *   comments: Comment[];
 * }
 * ```
 */
export class Model<T extends Attributes = Attributes> {
  /**
   * Custom query scopes that can be applied to model queries.
   * Each scope is a function that modifies the query builder behavior.
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
   * Internal query builder instance for constructing API requests.
   * @private
   */
  readonly #queryBuilder: QueryBuilder;

  /**
   * Resource endpoint for the model, used to construct API URLs.
   * Must be set by subclasses to define the API endpoint.
   * @example
   * ```typescript
   * static resource = 'users';
   * ```
   */
  static resource: string;

  /**
   * Creates a new model instance with the given attributes.
   * Initializes the query builder and sets up the model's state.
   * Can optionally accept an existing query builder instance.
   *
   * @param attributes - The attributes to initialize the model with
   * @param parentQuery - Optional query builder instance to use instead of creating a new one
   * @returns A new model instance
   * @throws {Error} If required attributes are missing
   * @example
   * ```typescript
   * // Create with basic attributes
   * const user = new User({ name: 'John', email: 'john@example.com' });
   *
   * // Create with existing query builder
   * const query = new QueryBuilder().where({ status: 'active' });
   * const user = new User({ name: 'John' }, query);
   * ```
   */
  constructor(attributes: T, parentQuery?: QueryBuilder) {
    if (attributes) {
      Object.assign(this, attributes);
    }

    
    this.#queryBuilder = parentQuery ?? new QueryBuilder({
      model: this.constructor as unknown as typeof Model,
      id: this.id,
    });

    return this;
  }

  /**
   * Gets the query builder instance for this model.
   * Used internally for constructing API requests.
   * Provides access to the current query state and parameters.
   *
   * @returns The query builder instance
   * @protected
   * @example
   * ```typescript
   * class CustomModel extends Model {
   *   async customQuery() {
   *     const query = this.queryBuilder
   *       .where({ status: 'active' })
   *       .limit(10);
   *     // Use query for custom operations
   *   }
   * }
   * ```
   */
  get queryBuilder() {
    return this.#queryBuilder;
  }

  /**
   * Gets the Fluentity instance for making API requests.
   * Provides access to the singleton instance that manages API communication.
   * Used internally for all API operations.
   *
   * @protected
   * @returns The singleton Fluentity instance
   * @throws {Error} If Fluentity has not been initialized
   * @example
   * ```typescript
   * class CustomModel extends Model {
   *   async customOperation() {
   *     const fluentity = this.fluentity;
   *     // Use fluentity for custom API operations
   *   }
   * }
   * ```
   */
  protected get fluentity(): Fluentity<RestAdapter> {
    return Fluentity.getInstance<RestAdapter>();
  }

  /**
   * Gets or creates a relation builder for the given model class.
   * Uses an internal cache to avoid creating duplicate relation builders.
   * Supports both has-one and has-many relationships.
   *
   * @param modelConstructor - The model constructor to create a relation builder for
   * @param relationBuilderFactory - The factory class to create the relation builder
   * @returns A relation builder instance configured for the model
   * @private
   * @example
   * ```typescript
   * // Internal usage in relationship decorators
   * const userBuilder = Model.getRelationBuilder(User, HasOneRelationBuilder);
   * const postsBuilder = Model.getRelationBuilder(Post, HasManyRelationBuilder);
   * ```
   */
  private static getRelationBuilder<T extends Model<Attributes>, R extends RelationBuilder<T>>(
    modelConstructor: Constructor<T>,
    relationBuilderFactory: Constructor<R>
  ): R {
    const modelInstance = new modelConstructor({});
    return new relationBuilderFactory(modelInstance);
  }

  /**
   * Creates a new model instance with the given ID.
   * Useful for creating model instances when only the ID is known.
   * The instance can be used for operations that only require the ID.
   *
   * @param id - The ID to assign to the new model instance
   * @returns A new model instance with the specified ID
   * @example
   * ```typescript
   * // Create a reference to an existing user
   * const user = User.id(123);
   * await user.get(); // Fetch full user data
   *
   * // Use for relationship operations
   * const post = await Post.create({
   *   title: 'New Post',
   *   author: User.id(123)
   * });
   * ```
   */
  static id<T extends Model<Attributes>>(this: Constructor<T>, id: string | number): T {
    return new this({ id });
  }

  /**
   * Starts a new query builder for the model.
   * Returns a HasManyRelationBuilder for querying multiple records.
   * Provides a fluent interface for building complex queries.
   *
   * @returns A HasManyRelationBuilder instance for building queries
   * @example
   * ```typescript
   * // Basic query with filters
   * const users = await User.query()
   *   .where({ status: 'active' })
   *   .orderBy('created_at', 'desc')
   *   .all();
   *
   * // Complex query with multiple conditions
   * const users = await User.query()
   *   .filter({
   *     age: { gt: 18 },
   *     role: ['admin', 'moderator']
   *   })
   *   .orderBy('name', 'asc')
   *   .limit(50)
   *   .offset(100)
   *   .all();
   * ```
   */
  static query<T extends Model<Attributes>>(this: Constructor<T>): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder);
  }

  /**
   * Starts a query with a where clause.
   * Shorthand for query().where() for common filtering operations.
   * Useful for simple equality-based queries.
   *
   * @param where - Conditions to filter by, as field-value pairs
   * @returns A HasManyRelationBuilder instance with where conditions applied
   * @example
   * ```typescript
   * // Simple equality conditions
   * const activeUsers = await User.where({ active: true }).all();
   *
   * // Multiple conditions
   * const users = await User.where({
   *   role: 'admin',
   *   status: 'active',
   *   verified: true
   * }).all();
   * ```
   */
  static where<T extends Model<Attributes>>(
    this: Constructor<T>,
    where: Partial<Attributes>
  ): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(
      this,
      HasManyRelationBuilder
    ).where(where) as HasManyRelationBuilder<T>;
  }

  /**
   * Starts a query with filter conditions.
   * Similar to where() but specifically for filter operations.
   * Supports more complex filtering operations and operators.
   *
   * @param filters - Filter conditions to apply, as field-value pairs
   * @returns A HasManyRelationBuilder instance with filters applied
   * @example
   * ```typescript
   * // Comparison operators
   * const users = await User.filter({
   *   age: { gt: 18, lt: 65 },
   *   score: { gte: 1000 }
   * }).all();
   *
   * // Array conditions
   * const users = await User.filter({
   *   role: { in: ['admin', 'moderator'] },
   *   status: ['active', 'pending']
   * }).all();
   *
   * // Nested conditions
   * const users = await User.filter({
   *   profile: {
   *     verified: true,
   *     location: { ne: 'unknown' }
   *   }
   * }).all();
   * ```
   */
  static filter<T extends Model<Attributes>>(
    this: Constructor<T>,
    filters: Record<string, any>
  ): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(
      this,
      HasManyRelationBuilder
    ).filter(filters) as HasManyRelationBuilder<T>;
  }

  /**
   * Retrieves all records for the model.
   * Fetches all records from the API without any filtering.
   * Use with caution for large datasets - consider using pagination.
   *
   * @returns Promise resolving to an array of model instances
   * @example
   * ```typescript
   * // Get all users
   * const allUsers = await User.all();
   *
   * // Get all users with error handling
   * try {
   *   const users = await User.all();
   *   console.log(`Found ${users.length} users`);
   * } catch (error) {
   *   console.error('Failed to fetch users:', error);
   * }
   * ```
   */
  static async all<T extends Model<Attributes>>(this: Constructor<T>): Promise<T[]> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(
      this,
      HasManyRelationBuilder
    ).all()) as T[];
  }

  /**
   * Finds a single record by ID.
   * Fetches a specific record from the API by its ID.
   * Throws an error if the record is not found.
   *
   * @param id - The ID of the record to find
   * @returns Promise resolving to a model instance
   * @throws {Error} If the record is not found
   * @example
   * ```typescript
   * // Find a user by ID
   * const user = await User.find(123);
   *
   * // Find with error handling
   * try {
   *   const user = await User.find(123);
   *   console.log(`Found user: ${user.name}`);
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('User not found');
   *   } else {
   *     console.error('Error fetching user:', error);
   *   }
   * }
   * ```
   */
  static async find<T extends Model<Attributes>>(
    this: Constructor<T>,
    id: string | number
  ): Promise<T> {
    return (await Model.getRelationBuilder<T, HasOneRelationBuilder<T>>(
      this,
      HasOneRelationBuilder
    ).find(id)) as T;
  }

  /**
   * Creates a new record.
   * Sends a POST request to create a new record in the API.
   * Returns the created record with any server-generated fields.
   *
   * @param data - The data to create the record with
   * @returns Promise resolving to the created model instance
   * @throws {Error} If the creation fails
   * @example
   * ```typescript
   * // Create a new user
   * const user = await User.create({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   role: 'user'
   * });
   *
   * // Create with error handling
   * try {
   *   const user = await User.create({
   *     name: 'John Doe',
   *     email: 'john@example.com'
   *   });
   *   console.log(`Created user with ID: ${user.id}`);
   * } catch (error) {
   *   if (error.status === 422) {
   *     console.log('Validation failed:', error.errors);
   *   } else {
   *     console.error('Error creating user:', error);
   *   }
   * }
   * ```
   */
  static async create<A extends Partial<Attributes>, T extends Model<Attributes>>(
    this: Constructor<T>,
    data: A
  ): Promise<T> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(
      this,
      HasManyRelationBuilder
    ).create(data)) as T;
  }

  /**
   * Updates an existing record.
   * Sends a PUT/PATCH request to update a record in the API.
   * Can use either PUT (full update) or PATCH (partial update).
   *
   * @param id - The ID of the record to update
   * @param data - The data to update the record with
   * @param method - The HTTP method to use for the update (PUT or PATCH)
   * @returns Promise resolving to the updated model instance
   * @throws {Error} If the update fails
   * @example
   * ```typescript
   * // Full update with PUT
   * const user = await User.update(123, {
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   role: 'admin'
   * });
   *
   * // Partial update with PATCH
   * const user = await User.update(123, {
   *   name: 'John Doe'
   * }, Methods.PATCH);
   *
   * // Update with error handling
   * try {
   *   const user = await User.update(123, {
   *     email: 'new@example.com'
   *   });
   *   console.log(`Updated user: ${user.name}`);
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('User not found');
   *   } else if (error.status === 422) {
   *     console.log('Validation failed:', error.errors);
   *   } else {
   *     console.error('Error updating user:', error);
   *   }
   * }
   * ```
   */
  static async update<A extends Partial<Attributes>, T extends Model<Attributes>>(
    this: Constructor<T>,
    id: string | number,
    data: A,
    method: MethodType = Methods.PUT
  ): Promise<T> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(
      this,
      HasManyRelationBuilder
    ).update(id, data, method)) as T;
  }

  /**
   * Deletes a record by ID.
   * Sends a DELETE request to remove a record from the API.
   * Returns void on success, throws an error on failure.
   *
   * @param id - The ID of the record to delete
   * @returns Promise that resolves when the deletion is complete
   * @throws {Error} If the deletion fails
   * @example
   * ```typescript
   * // Delete a user
   * await User.delete(123);
   *
   * // Delete with error handling
   * try {
   *   await User.delete(123);
   *   console.log('User deleted successfully');
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('User not found');
   *   } else {
   *     console.error('Error deleting user:', error);
   *   }
   * }
   * ```
   */
  static async delete<T extends Model<Attributes>>(
    this: Constructor<T>,
    id: string | number
  ): Promise<void> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(
      this,
      HasManyRelationBuilder
    ).delete(id);
  }

  /**
   * Retrieves the current model instance from the server.
   * Updates the local instance with fresh data from the API.
   * Useful for refreshing model data or after updates.
   *
   * @returns Promise resolving to the updated model instance
   * @throws {Error} If the record is not found
   * @example
   * ```typescript
   * // Refresh user data
   * await user.get();
   * console.log(`User name: ${user.name}`);
   *
   * // Refresh with error handling
   * try {
   *   await user.get();
   *   console.log('User data refreshed');
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('User no longer exists');
   *   } else {
   *     console.error('Error refreshing user:', error);
   *   }
   * }
   * ```
   */
  async get(): Promise<this> {
    this.#queryBuilder.method = Methods.GET;
    const data = await this.fluentity.adapter.call(this.#queryBuilder);

    Object.assign(this, data.data);

    return this;
  }

  /**
   * Saves the current model instance to the server.
   * Creates a new record if the model doesn't have an ID, updates existing record otherwise.
   * Automatically determines whether to use POST or PUT/PATCH.
   *
   * @returns Promise resolving to the saved model instance
   * @throws {Error} If the save operation fails
   * @example
   * ```typescript
   * // Create a new user
   * const user = new User({ name: 'John', email: 'john@example.com' });
   * await user.save();
   *
   * // Update existing user
   * user.name = 'John Doe';
   * await user.save();
   *
   * // Save with error handling
   * try {
   *   await user.save();
   *   console.log(`User saved with ID: ${user.id}`);
   * } catch (error) {
   *   if (error.status === 422) {
   *     console.log('Validation failed:', error.errors);
   *   } else {
   *     console.error('Error saving user:', error);
   *   }
   * }
   * ```
   */
  async save(): Promise<this> {
    if (this.id) {
      return this.update();
    }

    this.#queryBuilder.method = Methods.POST;
    this.#queryBuilder.body = this.toObject();
    const data = await this.fluentity.adapter.call(this.#queryBuilder);
    Object.assign(this, data.data);
    return this;
  }

  /**
   * Updates the model instance with new attributes and saves to the server.
   * Can use either PUT (full update) or PATCH (partial update).
   * Updates the local instance with the server response.
   *
   * @param attributes - Optional attributes to update before saving
   * @param method - The HTTP method to use for the update (PUT or PATCH)
   * @returns Promise resolving to the updated model instance
   * @throws {Error} If the update fails
   * @example
   * ```typescript
   * // Full update with PUT
   * await user.update({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   role: 'admin'
   * });
   *
   * // Partial update with PATCH
   * await user.update({
   *   name: 'John Doe'
   * }, Methods.PATCH);
   *
   * // Update with error handling
   * try {
   *   await user.update({ name: 'John Doe' });
   *   console.log(`User updated: ${user.name}`);
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('User no longer exists');
   *   } else if (error.status === 422) {
   *     console.log('Validation failed:', error.errors);
   *   } else {
   *     console.error('Error updating user:', error);
   *   }
   * }
   * ```
   */
  async update(attributes?: Partial<T>, method: MethodType = Methods.PUT): Promise<this> {
    if (attributes) Object.assign(this, attributes);

    this.#queryBuilder.method = method;
    this.#queryBuilder.id = this.id;
    this.#queryBuilder.body = this.toObject();

    const updated = await this.fluentity.adapter.call(this.#queryBuilder);
    Object.assign(this, updated.data);

    return this;
  }

  /**
   * Deletes the model instance from the server.
   * Sends a DELETE request to remove the record.
   * The local instance remains but becomes detached from the server.
   *
   * @returns Promise that resolves when the deletion is complete
   * @throws {Error} If the deletion fails
   * @example
   * ```typescript
   * // Delete the user
   * await user.delete();
   *
   * // Delete with error handling
   * try {
   *   await user.delete();
   *   console.log('User deleted successfully');
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('User no longer exists');
   *   } else {
   *     console.error('Error deleting user:', error);
   *   }
   * }
   * ```
   */
  async delete(): Promise<void> {
    this.#queryBuilder.method = Methods.DELETE;
    await this.fluentity.adapter.call(this.#queryBuilder);
  }

  /**
   * Calls the adapter with the given query builder.
   * @param queryBuilder - The query builder to use
   * @returns The adapter response
   * @protected
   */
  protected async call(queryBuilder: QueryBuilder): Promise<AdapterResponse<T>> {
    return this.constructor.call(queryBuilder);
  }

  static async call(queryBuilder: QueryBuilder): Promise<AdapterResponse> {
    return (await Fluentity.getInstance().adapter.call(queryBuilder)) as AdapterResponse;
  }

  /**
   * Converts the model instance to a plain object.
   * Recursively converts nested model instances to plain objects.
   * Useful for serialization or sending data to the server.
   *
   * @returns A plain object representation of the model's attributes
   * @example
   * ```typescript
   * // Convert to plain object
   * const userData = user.toObject();
   * console.log(JSON.stringify(userData));
   *
   * // Convert with nested models
   * const post = await Post.find(123);
   * const postData = post.toObject();
   * // {
   * //   id: 123,
   * //   title: 'My Post',
   * //   author: {
   * //     id: 456,
   * //     name: 'John Doe'
   * //   },
   * //   comments: [
   * //     { id: 789, content: 'Great post!' }
   * //   ]
   * // }
   * ```
   */
  toObject(): Record<string, any> {
    const obj: Record<string, any> = {};

    Object.keys(this).forEach(key => {
      obj[key] = this[key as keyof this];
    });

    const descriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this));
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (descriptor.get) {
        const value = this[key as keyof this] as any;
        if (value instanceof Model) {
          obj[key] = value.toObject();
        } else if (Array.isArray(value) && value.length > 0) {
          obj[key] = value
            .filter((item: any) => item instanceof Model && typeof item.toObject === 'function')
            .map((item: Model<Attributes>) => item.toObject());
        }
      }
    }
    return obj;
  }

  /**
   * Resets properties on the model, setting them to undefined.
   * This is useful for clearing relationships or properties.
   * 
   * @param keys - The property keys to reset (accepts multiple keys)
   * @returns The model instance for method chaining
   * @example
   * ```typescript
   * // reset a relationship
   * user.reset('address');
   * // Now user.address is undefined
   * 
   * // reset multiple properties
   * user.reset('address', 'profile');
   * ```
   */
  reset(...keys: string[]): this {
    for (const key of keys) {
      this[key] = undefined;
    }
    return this;
  }
}
