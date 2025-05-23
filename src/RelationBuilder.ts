import { Model } from "./Model"
import { QueryBuilder } from "./QueryBuilder"
import { HasManyRelationBuilder } from "./HasManyRelationBuilder"
import { HasOneRelationBuilder } from "./HasOneRelationBuilder"
import { Fluentity, Methods } from "./Fluentity"
import { Constructor } from "./decorators"

/**
 * Type that determines the appropriate relation builder based on the model type.
 * @template T - The model type to determine the relation builder for
 */
export type Relation<T> = T extends Model<any>
    ? HasOneRelationBuilder<T>
    : T extends Array<Model<any>>
        ? HasManyRelationBuilder<T[number]>
        : never

/**
 * Base class for building and managing relationships between models.
 * Provides methods for querying related models and building API requests.
 * @template T - The type of model this relation builder works with
 */
export class RelationBuilder<T extends Model<any>> {
    /** Query builder instance for constructing API URLs and managing query parameters */
    public queryBuilder: QueryBuilder
    /** The related model instance that this builder operates on */
    protected relatedModel: T

    /**
     * Creates a new relation builder instance.
     * @param model - Factory function that returns a model instance
     * @param queryBuilder - Optional query builder instance
     */
    constructor(
        model: T,
        queryBuilder: QueryBuilder,
        resource?: string
    ) {
        
        this.relatedModel = model
        this.queryBuilder = queryBuilder

        const path = resource ?? (this.relatedModel as any).resource

        if (queryBuilder.path) {
            this.queryBuilder.path = queryBuilder.path + '/' + path
        } else {
            this.queryBuilder.path = path
        }

        if (this.relatedModel.scopes) {
            Object.entries(this.relatedModel.scopes).forEach(([name, scope]) => {
                (this as any)[name] = (...args: any[]) => {
                    return (scope as any)(this, ...args) as RelationBuilder<T>
                }
            })
        }
    }

    /** Type definition for dynamic scope methods that can be added at runtime */
    [key: string]: any

    /**
     * Gets the Fluentity instance for making API requests.
     * @protected
     * @returns The singleton Fluentity instance
     */
    protected get fluentity() {
        return Fluentity.getInstance();
    }
    
    /**
     * Gets a model instance by ID without making an API request.
     * @param id - The ID of the model to get
     * @returns A new model instance with the given ID
     */
    id(id: string | number): T { 
        const model = new (this.relatedModel as any)({ id }, this.queryBuilder)
        model.queryBuilder.id = id
        return model
    }

    /**
     * Fetches a model instance by ID from the API.
     * @param id - The ID of the model to fetch
     * @returns A promise that resolves to the fetched model instance
     */
    async find(id: string | number): Promise<T> {
        this.queryBuilder.id = id
        this.queryBuilder.method = Methods.GET

        const response = await this.fluentity.adapter.call(this.queryBuilder)
        const model = new (this.relatedModel as any)(response.data, this.queryBuilder)
        model.queryBuilder.id = id
        return model
    }

    /**
     * Adds a where clause to the query.
     * @param where - Object containing field-value pairs to filter by
     * @returns The relation builder instance for chaining
     */
    where(where: Record<string, any>): RelationBuilder<T> { 
        this.queryBuilder.where(where)
        return this
    }

    /**
     * Adds filter conditions to the query.
     * @param filters - Object containing filter conditions
     * @returns The relation builder instance for chaining
     */
    filter(filters: Record<string, any>): RelationBuilder<T> { 
        this.queryBuilder.filter(filters)
        return this
    }

    /**
     * Adds an order by clause to the query.
     * @param field - The field to order by
     * @param dir - The direction to order in ('asc' or 'desc')
     * @returns The relation builder instance for chaining
     */
    orderBy(sort: string = 'id', direction: string = 'asc'): RelationBuilder<T> { 
        this.queryBuilder.sort = sort
        this.queryBuilder.direction = direction
        return this
    }

    /**
     * Limits the number of results returned.
     * @param n - The maximum number of results to return
     * @returns The relation builder instance for chaining
     */
    limit(n: number): RelationBuilder<T> { 
        this.queryBuilder.limit = n
        return this
    }

    /**
     * Sets the offset for pagination in the query results.
     * @param n - The number of records to skip
     * @returns The relation builder instance for chaining
     */
    offset(n: number): RelationBuilder<T> { 
        this.queryBuilder.offset = n
        return this
    }
}
