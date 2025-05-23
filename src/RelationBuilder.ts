import { Model } from "./Model"
import { QueryBuilder } from "./QueryBuilder"
import { HasManyRelationBuilder } from "./HasManyRelationBuilder"
import { HasOneRelationBuilder } from "./HasOneRelationBuilder"
import { Fluentity, Methods } from "./Fluentity"
import { Constructor } from "./decorators"

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
export type Relation<T> = T extends Model<any>
    ? HasOneRelationBuilder<T>
    : T extends Array<Model<any>>
        ? HasManyRelationBuilder<T[number]>
        : never

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
export class RelationBuilder<T extends Model<any>> {
    /** 
     * Query builder instance for constructing API URLs and managing query parameters.
     * Used internally to build the request URL and parameters.
     */
    public queryBuilder: QueryBuilder

    /** 
     * The related model instance that this builder operates on.
     * Used to create new instances of the related model.
     * @protected
     */
    protected relatedModel: T

    /**
     * Creates a new relation builder instance.
     * Sets up the query builder and configures the resource path.
     * 
     * @param model - The model instance to build relations for
     * @param queryBuilder - Query builder instance for constructing API requests
     * @param resource - Optional custom resource name for the relation
     * @throws {Error} If the model or query builder is invalid
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

    /** 
     * Type definition for dynamic scope methods that can be added at runtime.
     * Allows for custom query scopes to be added to the builder.
     */
    [key: string]: any

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
    id(id: string | number): T { 
        const model = new (this.relatedModel as any)({ id }, this.queryBuilder)
        model.queryBuilder.id = id
        return model
    }

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
     * Filters results based on exact field-value matches.
     * 
     * @param where - Object containing field-value pairs to filter by
     * @returns The relation builder instance for chaining
     * @example
     * ```typescript
     * const posts = await user.posts.where({ published: true }).all();
     * ```
     */
    where(where: Record<string, any>): RelationBuilder<T> { 
        this.queryBuilder.where(where)
        return this
    }

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
    filter(filters: Record<string, any>): RelationBuilder<T> { 
        this.queryBuilder.filter(filters)
        return this
    }

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
    orderBy(sort: string = 'id', direction: string = 'asc'): RelationBuilder<T> { 
        this.queryBuilder.sort = sort
        this.queryBuilder.direction = direction
        return this
    }

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
    limit(n: number): RelationBuilder<T> { 
        this.queryBuilder.limit = n
        return this
    }

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
    offset(n: number): RelationBuilder<T> { 
        this.queryBuilder.offset = n
        return this
    }
}
