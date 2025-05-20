import { RelationBuilder, type Relation } from './RelationBuilder'
import { HttpClient, Methods } from './HttpClient'
import { HasOneRelationBuilder } from './HasOneRelationBuilder'
import { HasManyRelationBuilder } from './HasManyRelationBuilder'
import { Constructor } from './decorators'

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
  /** Custom query scopes that can be applied to model queries */
  static scopes?: Record<string, (query: RelationBuilder<any>) => RelationBuilder<any>>
  #path: string

  /** Unique identifier for the model instance */
  id?: string | number
  [key: string]: any

  /** Resource endpoint for the model */
  static resource: string

  /** Cache for relation builders to prevent unnecessary instantiation */
  private static _relationCache = new Map<string, any>()

  /**
   * Creates a new model instance with the given attributes.
   * @param attributes - The attributes to initialize the model with
   * @returns A new model instance
   */
  constructor(attributes: T) {
    if (attributes) {
      Object.assign(this, attributes)
    }

    this.#path = (this.constructor as any).path ?? (this.constructor as any).resource

    if (this.id) {
      this.path += `/${this.id}`
    }

    return this
  }

  /**
   * Gets the current path for the model instance.
   * The path represents the API endpoint for this model.
   */
  get path(): string {
    return this.#path
  }

  /**
   * Sets the path for the model instance.
   * @param path - New path value to set
   */
  set path(path: string) {
    this.#path = path
  }

  /**
   * Gets or creates a relation builder for the given model class.
   * Uses an internal cache to avoid creating duplicate relation builders.
   * @param modelClass - The model class to create a relation builder for
   * @param relationBuilderFactory - The factory class to create the relation builder
   * @returns A relation builder instance
   */
  private static getRelationBuilder<T extends Model<any>, R extends RelationBuilder<T>>(
    modelClass: Constructor<Model<any>>,
    relationBuilderFactory: Constructor<R>
  ): R {
    const key = `${modelClass.name}_${relationBuilderFactory.name}`
    if (!Model._relationCache.has(key)) {
      const model = modelClass as any
      const resource = model.resource
      Model._relationCache.set(key, new relationBuilderFactory(() => modelClass as any, undefined, resource))
    }
    return Model._relationCache.get(key) as R
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
  static query<T extends Model<Attributes>>(this: Constructor<T>): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder)
  }

  /**
   * Starts a query with a where clause
   * @param where - Conditions to filter by
   * @returns A HasManyRelationBuilder instance with where conditions applied
   */
  static where<T extends Model<Attributes>>(this: Constructor<T>, where: Partial<Attributes>): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).where(where) as HasManyRelationBuilder<T>
  }

  /**
   * Starts a query with filter conditions
   * @param filters - Filter conditions to apply
   * @returns A HasManyRelationBuilder instance with filters applied
   */
  static filter<T extends Model<Attributes>>(this: Constructor<T>, filters: Record<string, any>): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).filter(filters) as HasManyRelationBuilder<T>
  }

  /**
   * Starts a query with relations to include
   * @param relations - Single relation or array of relations to include
   * @returns A HasManyRelationBuilder instance with relations included
   */
  static include<T extends Model<Attributes>>(this: Constructor<T>, relations: string | string[]): HasManyRelationBuilder<T> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).include(relations) as HasManyRelationBuilder<T>
  }

  /**
   * Retrieves all records for the model
   * @returns Promise resolving to an array of model instances
   */
  static async all<T extends Model<Attributes>>(this: Constructor<T>): Promise<T[]> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).all()) as T[]
  }

  /**
   * Finds a single record by ID
   * @param id - The ID to find
   * @returns Promise resolving to a model instance
   */
  static async find<T extends Model<Attributes>>(this: Constructor<T>, id: string | number): Promise<T> {
    return (await Model.getRelationBuilder<T, HasOneRelationBuilder<T>>(this, HasOneRelationBuilder).find(id)) as T
  }

  /**
   * Creates a new record
   * @param data - The data to create the record with
   * @returns Promise resolving to the created model instance
   */
  static async create<A extends Partial<Attributes>, T extends Model<Attributes>>(this: Constructor<T>, data: A): Promise<T> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).create(data)) as T
  }

  /**
   * Updates an existing record
   * @param id - The ID of the record to update
   * @param data - The data to update the record with
   * @returns Promise resolving to the updated model instance
   */
  static async update<A extends Partial<Attributes>, T extends Model<Attributes>>(this: Constructor<T>, id: string | number, data: A): Promise<T> {
    return (await Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).update(id, data)) as T
  }

  /**
   * Deletes a record by ID
   * @param id - The ID of the record to delete
   * @returns Promise that resolves when the deletion is complete
   */
  static async delete<T extends Model<Attributes>>(this: Constructor<T>, id: string | number): Promise<void> {
    return Model.getRelationBuilder<T, HasManyRelationBuilder<T>>(this, HasManyRelationBuilder).delete(id)
  }

  /**
   * Retrieves the current model instance from the server
   * @returns Promise resolving to the updated model instance
   */
  async get(): Promise<this> {
    const path = (this.constructor as any).path

    const data = await HttpClient.call(`${path}/${this.id}`, {
      method: Methods.GET,
    })

    Object.assign(this, data)

    return this
  }

  /**
   * Saves the current model instance to the API.
   * Creates a new record if the model has no ID, updates existing record otherwise.
   * @returns A promise that resolves to the saved model instance
   */
  async save(): Promise<this> {
    if (this.id) {
      return this.update()
    }

    const path = (this.constructor as any).path

    const data = await HttpClient.call(path, {
      method: Methods.POST,
      body: { ...this }
    })
    Object.assign(this, data)
    return this
  }

  /**
   * Updates the current model instance with new attributes.
   * @param attributes - The attributes to update
   * @returns A promise that resolves to the updated model instance
   */
  async update(attributes?: Partial<T>): Promise<this> {
    const path = (this.constructor as any).path

    if (attributes) Object.assign(this, attributes)
    const updated = await HttpClient.call(`${path}/${this.id}`, {
      method: Methods.PATCH,
      body: { ...this }
    })
    Object.assign(this, updated)
    return this
  }

  /**
   * Deletes the current model instance from the API.
   * @returns A promise that resolves when the deletion is complete
   * @throws Error if the model has no ID
   */
  async delete(): Promise<void> {
    const path = (this.constructor as any).path

    await HttpClient.call(`${path}/${this.id}`, {
      method: Methods.DELETE
    })
  }

  /**
   * Converts the model instance to a plain object
   * Handles nested model instances and arrays of models
   * @returns A plain object representation of the model
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
          obj[key] = value.filter((item: any) => item instanceof Model).map((item: Model<any>) => item.toObject())
        }
      }
    }
    return obj
  }
}