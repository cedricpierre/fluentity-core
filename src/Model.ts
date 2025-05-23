import { RelationBuilder, type Relation } from './RelationBuilder'
import { HasOneRelationBuilder } from './HasOneRelationBuilder'
import { HasManyRelationBuilder } from './HasManyRelationBuilder'
import { Constructor } from './decorators'
import { Fluentity, Methods, MethodType } from './Fluentity'
import { QueryBuilder } from './QueryBuilder'

/**
 * Base interface for model attributes that all models must implement.
 * Provides the basic structure for model data.
 */
export interface Attributes {
  /** Unique identifier for the model instance */
  id?: string | number
  [key: string]: any
}

/**
 * Base class for all models in the ORM.
 * Provides core functionality for interacting with the API and managing model data.
 * @template T - The type of attributes this model will have
 */
export class Model<T extends Attributes = Attributes> {
  /** Custom query scopes that can be applied to model queries to modify the query builder behavior */
  static scopes?: Record<string, (query: RelationBuilder<any>) => RelationBuilder<any>>

  /** Unique identifier for the model instance */
  id?: string | number
  /** Index signature for dynamic properties */
  [key: string]: any

  /** Query builder for the model */
  #queryBuilder: QueryBuilder

  /** Resource endpoint for the model, used to construct API URLs */
  static resource: string

  /** Cache for relation builders to prevent unnecessary instantiation and improve performance */
  static #relationCache = new Map<string, any>()

  /**
   * Creates a new model instance with the given attributes.
   * @param attributes - The attributes to initialize the model with
   * @returns A new model instance
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

  get queryBuilder() {
    return this.#queryBuilder
  }

  /**
   * Gets the Fluentity instance for making API requests.
   * @protected
   * @returns The singleton Fluentity instance
   */
  protected get fluentity() {
    return Fluentity.getInstance();
  }

  /**
   * Gets or creates a relation builder for the given model class.
   * Uses an internal cache to avoid creating duplicate relation builders.
   * @param modelClass - The model class to create a relation builder for
   * @param relationBuilderFactory - The factory class to create the relation builder
   * @returns A relation builder instance
   */
  private static getRelationBuilder<T extends Model<any>, R extends RelationBuilder<T>>(
    model: T,
    relationBuilderFactory: Constructor<R>
  ): R {
    const queryBuilder = new QueryBuilder()

    return new relationBuilderFactory(model, queryBuilder, model.resource)
  }

  /**
   * Creates a new model instance with the given ID.
   * @param id - The ID to assign to the new model instance
   * @returns A new model instance with the specified ID
   */
  static id<T extends Model<any>>(this: Constructor<T>, id: string | number): T {
    return new this({ id })
  }

  /**
   * Starts a new query builder for the model
   * @returns A HasManyRelationBuilder instance
   */
  static query<T extends Model<Attributes>>(this: T): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder)
  }

  /**
   * Starts a query with a where clause
   * @param where - Conditions to filter by
   * @returns A HasManyRelationBuilder instance with where conditions applied
   */
  static where<T extends Model<Attributes>>(this: T, where: Partial<Attributes>): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).where(where) as HasManyRelationBuilder<T>
  }

  /**
   * Starts a query with filter conditions
   * @param filters - Filter conditions to apply
   * @returns A HasManyRelationBuilder instance with filters applied
   */
  static filter<T extends Model<Attributes>>(this: T, filters: Record<string, any>): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).filter(filters) as HasManyRelationBuilder<T>
  }

  /**
   * Starts a query with relations to include
   * @param relations - Single relation or array of relations to include
   * @returns A HasManyRelationBuilder instance with relations included
   */
  static include<T extends Model<Attributes>>(this: T, relations: string | string[]): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).include(relations) as HasManyRelationBuilder<T>
  }

  /**
   * Retrieves all records for the model
   * @returns Promise resolving to an array of model instances
   */
  static async all<T extends Model<Attributes>>(this: T): Promise<T[]> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).all()) as T[]
  }

  /**
   * Finds a single record by ID
   * @param id - The ID to find
   * @returns Promise resolving to a model instance
   */
  static async find<T extends Model<Attributes>>(this: T, id: string | number): Promise<T> {
    return (await Model.getRelationBuilder<T, HasOneRelationBuilder<T>>(this, HasOneRelationBuilder).find(id)) as T
  }

  /**
   * Creates a new record
   * @param data - The data to create the record with
   * @returns Promise resolving to the created model instance
   */
  static async create<A extends Partial<Attributes>, T extends Model<Attributes>>( this: T, data: A): Promise<T> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).create(data)) as T
  }

  /**
   * Updates an existing record
   * @param id - The ID of the record to update
   * @param data - The data to update the record with
   * @returns Promise resolving to the updated model instance
   */
  static async update<A extends Partial<Attributes>, T extends Model<Attributes>>(this: T, id: string | number, data: A, method: MethodType = Methods.PUT): Promise<T> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).update(id, data, method)) as T
  }

  /**
   * Deletes a record by ID
   * @param id - The ID of the record to delete
   * @returns Promise that resolves when the deletion is complete
   */
  static async delete<T extends Model<Attributes>>(this: T, id: string | number): Promise<void> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).delete(id)
  }

  /**
   * Retrieves the current model instance from the server.
   * Updates the local instance with fresh data from the API.
   * @returns Promise resolving to the updated model instance
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
   * @returns Promise resolving to the saved model instance
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
   * @param attributes - Optional attributes to update before saving
   * @returns Promise resolving to the updated model instance
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
   * @returns Promise that resolves when the deletion is complete
   */
  async delete(): Promise<void> {
    this.#queryBuilder.method = Methods.DELETE
    await this.fluentity.adapter.call(this.#queryBuilder)
  }

  /**
   * Converts the model instance to a plain object.
   * @returns A plain object representation of the model's attributes
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