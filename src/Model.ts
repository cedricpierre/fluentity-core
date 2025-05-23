import { RelationBuilder, type Relation } from './RelationBuilder'
import { HasOneRelationBuilder } from './HasOneRelationBuilder'
import { HasManyRelationBuilder } from './HasManyRelationBuilder'
import { Constructor } from './decorators'
import { Fluentity, Methods, MethodType } from './Fluentity'
import { QueryBuilder } from './QueryBuilder'

/**
 * Base interface for model attributes that all models must implement.
 * Provides the basic structure for model data and allows for dynamic properties.
 * @interface
 */
export interface Attributes {
  /** Unique identifier for the model instance. Can be either a string or number. */
  id?: string | number
  /** Index signature allowing for dynamic properties of any type */
  [key: string]: any
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
export class Model<T extends Attributes = Attributes> {
  /** 
   * Custom query scopes that can be applied to model queries.
   * Each scope is a function that modifies the query builder behavior.
   * @static
   */
  static scopes?: Record<string, (query: RelationBuilder<any>) => RelationBuilder<any>>

  /** 
   * Unique identifier for the model instance.
   * Can be either a string or number, depending on the API's ID format.
   */
  id?: string | number

  /** 
   * Index signature for dynamic properties.
   * Allows models to have additional properties beyond their defined attributes.
   */
  [key: string]: any

  /** 
   * Internal query builder instance for constructing API requests.
   * @private
   */
  #queryBuilder: QueryBuilder

  /** 
   * Resource endpoint for the model, used to construct API URLs.
   * Must be set by subclasses to define the API endpoint.
   * @static
   * @example
   * ```typescript
   * static resource = 'users';
   * ```
   */
  static resource: string

  /**
   * Creates a new model instance with the given attributes.
   * Initializes the query builder and sets up the model's state.
   * 
   * @param attributes - The attributes to initialize the model with
   * @param queryBuilder - Optional query builder instance to use instead of creating a new one
   * @returns A new model instance
   * @throws {Error} If required attributes are missing
   */
  constructor(attributes: T, queryBuilder?: QueryBuilder) {
    if (attributes) {
      Object.assign(this, attributes)
    }

    if (queryBuilder) {
      this.#queryBuilder = queryBuilder
    } else {
      this.#queryBuilder = new QueryBuilder()
      this.#queryBuilder.path = (this.constructor as any).resource
    }
    
    this.#queryBuilder.id = this.id
    return this
  }

  /**
   * Gets the query builder instance for this model.
   * Used internally for constructing API requests.
   * @returns The query builder instance
   * @protected
   */
  get queryBuilder() {
    return this.#queryBuilder
  }

  /**
   * Gets the Fluentity instance for making API requests.
   * Provides access to the singleton instance that manages API communication.
   * 
   * @protected
   * @returns The singleton Fluentity instance
   * @throws {Error} If Fluentity has not been initialized
   */
  protected get fluentity() {
    return Fluentity.getInstance();
  }

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
  private static getRelationBuilder<T extends Model<any>, R extends RelationBuilder<T>>(
    model: Constructor<T>,
    relationBuilderFactory: Constructor<R>
  ): R {
    const queryBuilder = new QueryBuilder()

    return new relationBuilderFactory(model, queryBuilder, (model.constructor as any).resource)
  }

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
  static id<T extends Model<any>>(this: Constructor<T>, id: string | number): T {
    return new this({ id })
  }

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
  static query<T extends Model<Attributes>>(this: Constructor<T>): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder)
  }

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
  static where<T extends Model<Attributes>>(this: Constructor<T>, where: Partial<Attributes>): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).where(where) as HasManyRelationBuilder<T>
  }

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
  static filter<T extends Model<Attributes>>(this: Constructor<T>, filters: Record<string, any>): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).filter(filters) as HasManyRelationBuilder<T>
  }

  /**
   * Starts a query with relations to include.
   * Specifies which related models should be loaded with the query.
   * 
   * @param relations - Single relation or array of relations to include
   * @returns A HasManyRelationBuilder instance with relations included
   * @static
   * @example
   * ```typescript
   * const users = await User.include(['posts', 'profile']).all();
   * ```
   */
  static include<T extends Model<Attributes>>(this: Constructor<T>, relations: string | string[]): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).include(relations) as HasManyRelationBuilder<T>
  }

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
  static async all<T extends Model<Attributes>>(this: Constructor<T>): Promise<T[]> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).all()) as T[]
  }

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
  static async find<T extends Model<Attributes>>(this: Constructor<T>, id: string | number): Promise<T> {
    return (await Model.getRelationBuilder<T, HasOneRelationBuilder<T>>(this, HasOneRelationBuilder).find(id)) as T
  }

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
  static async create<A extends Partial<Attributes>, T extends Model<Attributes>>(this: Constructor<T>, data: A): Promise<T> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).create(data)) as T
  }

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
  static async update<A extends Partial<Attributes>, T extends Model<Attributes>>(
    this: Constructor<T>, 
    id: string | number, 
    data: A, 
    method: MethodType = Methods.PUT
  ): Promise<T> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).update(id, data, method)) as T
  }

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
  static async delete<T extends Model<Attributes>>(this: Constructor<T>, id: string | number): Promise<void> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).delete(id)
  }

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
  async get(): Promise<this> {
    this.#queryBuilder.method = Methods.GET
    const data = await this.fluentity.adapter.call(this.#queryBuilder)

    Object.assign(this, data.data)

    return this
  }

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
  async save(): Promise<this> {
    if (this.id) {
      return this.update()
    }


    this.#queryBuilder.method = Methods.POST
    this.#queryBuilder.body = this.toObject()
    const data = await this.fluentity.adapter.call(this.#queryBuilder)
    Object.assign(this, data.data)
    return this
  }

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
  async update(attributes?: Partial<T>, method: MethodType = Methods.PUT): Promise<this> {
    if (attributes) Object.assign(this, attributes)

    this.#queryBuilder.method = method
    this.#queryBuilder.body = this.toObject()

    const updated = await this.fluentity.adapter.call(this.#queryBuilder)
    Object.assign(this, updated.data)

    return this
  }

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
  async delete(): Promise<void> {
    this.#queryBuilder.method = Methods.DELETE
    await this.fluentity.adapter.call(this.#queryBuilder)
  }

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
  toObject(): Record<string, any> {
    const obj: Record<string, any> = {}

    Object.keys(this).forEach(key => {
      obj[key] = this[key as keyof this]
    })

    const descriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this))
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (descriptor.get) {
        const value = this[key as keyof this] as any
        if (value instanceof Model) {
          obj[key] = value.toObject()
        } else if (Array.isArray(value) && value.length > 0) {
          obj[key] = value.filter((item: any) => item instanceof Model && typeof item.toObject === 'function').map((item: Model<any>) => item.toObject())
        }
      }
    }
    return obj
  }
}