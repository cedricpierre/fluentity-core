import { Methods, MethodType } from "./Fluentity"
import { Attributes, Model } from "./Model"
import { RelationBuilder } from "./RelationBuilder"

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
export class HasManyRelationBuilder<T extends Model<any>> extends RelationBuilder<T> {
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
    async all(): Promise<T[]> {
        this.queryBuilder.method = Methods.GET
        this.queryBuilder.id = undefined
        const list = await this.fluentity.adapter.call(this.queryBuilder)
        return list?.data?.map((i: any) => new (this.relatedModel as any)(i, {...this.queryBuilder}))
    }

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
    async create<A extends Partial<Attributes>>(data: A): Promise<T> {
        this.queryBuilder.method = Methods.POST
        this.queryBuilder.body = data
        this.queryBuilder.id = undefined
        const response = await this.fluentity.adapter.call(this.queryBuilder)
        return new (this.relatedModel as any)(response.data, {...this.queryBuilder})
    }

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
    async delete(id: string | number): Promise<void> {
        this.queryBuilder.method = Methods.DELETE
        this.queryBuilder.id = id
        await this.fluentity.adapter.call(this.queryBuilder)
    }

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
    async update<A extends Partial<Attributes>>(id: string | number, data: A, method: MethodType = Methods.PUT): Promise<T> {
        this.queryBuilder.method = method
        this.queryBuilder.id = id
        this.queryBuilder.body = data
        const response = await this.fluentity.adapter.call(this.queryBuilder)
        return new (this.relatedModel as any)(response.data, {...this.queryBuilder})
    }

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
    async paginate(page = 1, perPage = 10): Promise<T[]> {
        this.queryBuilder.page = page
        this.queryBuilder.perPage = perPage
        this.queryBuilder.offset = (page - 1) * perPage
        this.queryBuilder.limit = perPage

        const list = await this.fluentity.adapter.call(this.queryBuilder)
        return list?.data?.map((i: any) => new (this.relatedModel as any)(i, {...this.queryBuilder}))
    }
}
