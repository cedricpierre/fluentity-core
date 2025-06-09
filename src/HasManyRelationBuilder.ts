import { Methods, MethodType } from './Fluentity';
import { Attributes, Model } from './Model';
import { RelationBuilder } from './RelationBuilder';

/**
 * Builder class for has-many relationships between models.
 * Provides methods for managing a one-to-many relationship with another model.
 * Used when a model has multiple related model instances.
 * 
 * Features:
 * - Collection retrieval and filtering
 * - Model creation
 * - Model updates
 * - Model deletion
 * - Pagination support
 * - Relationship traversal
 *
 * @template T - The type of model this relation builder works with
 * @example
 * ```typescript
 * // Basic usage in a model
 * class User extends Model {
 *   @HasMany(() => Post)
 *   posts: Post[];
 * }
 * 
 * // Usage in queries
 * const posts = await user.posts.all();
 * const post = await user.posts.create({ title: 'New Post' });
 * await user.posts.update(123, { title: 'Updated Post' });
 * await user.posts.delete(123);
 * ```
 */
export class HasManyRelationBuilder<T extends Model<Attributes>> extends RelationBuilder<T> {
  /**
   * Fetches all related model instances.
   * Makes a GET request to retrieve all related models.
   * Use with caution for large collections - consider using pagination.
   *
   * @returns A promise that resolves to an array of related model instances
   * @throws {Error} If the request fails
   * @example
   * ```typescript
   * // Get all posts
   * const posts = await user.posts.all();
   * console.log(`Found ${posts.length} posts`);
   * 
   * // Get with filtering
   * const posts = await user.posts
   *   .where({ status: 'published' })
   *   .orderBy('created_at', 'desc')
   *   .all();
   * 
   * // Get with error handling
   * try {
   *   const posts = await user.posts.all();
   *   console.log('Posts loaded successfully');
   * } catch (error) {
   *   console.error('Error loading posts:', error);
   * }
   * 
   * // Use in relationship chain
   * const user = await User.find(123);
   * const comments = await user.posts
   *   .find(456)
   *   .comments
   *   .all();
   * ```
   */
  async all(): Promise<T[]> {
    this._queryBuilder.method = Methods.GET;
    this._queryBuilder.id = undefined;
    const list = await this.fluentity.adapter.call(this._queryBuilder);
    return list?.data?.map((i: any) => new (this._relatedModel as any)(i, { ...this._queryBuilder }));
  }

  /**
   * Creates a new related model instance.
   * Makes a POST request to create a new related model.
   * The new model is automatically associated with the parent model.
   *
   * @param data - The data to create the new model with
   * @returns A promise that resolves to the created model instance
   * @throws {Error} If the creation fails
   * @example
   * ```typescript
   * // Create a new post
   * const post = await user.posts.create({
   *   title: 'New Post',
   *   content: 'Post content',
   *   status: 'draft'
   * });
   * 
   * // Create with error handling
   * try {
   *   const post = await user.posts.create({
   *     title: 'New Post',
   *     content: 'Post content'
   *   });
   *   console.log(`Created post with ID: ${post.id}`);
   * } catch (error) {
   *   if (error.status === 422) {
   *     console.log('Validation failed:', error.errors);
   *   } else {
   *     console.error('Error creating post:', error);
   *   }
   * }
   * 
   * // Create in relationship chain
   * const user = await User.find(123);
   * const comment = await user.posts
   *   .find(456)
   *   .comments
   *   .create({ content: 'Great post!' });
   * ```
   */
  async create<A extends Partial<Attributes>>(data: A): Promise<T> {
    this._queryBuilder.method = Methods.POST;
    this._queryBuilder.body = data;
    this._queryBuilder.id = undefined;
    const response = await this.fluentity.adapter.call(this._queryBuilder);
    return new (this._relatedModel as any)(response.data, { ...this._queryBuilder });
  }

  /**
   * Deletes a related model instance by ID.
   * Makes a DELETE request to remove a specific related model.
   * The local instance remains but becomes detached from the server.
   *
   * @param id - The ID of the model to delete
   * @returns A promise that resolves when the deletion is complete
   * @throws {Error} If the deletion fails
   * @example
   * ```typescript
   * // Delete a post
   * await user.posts.delete(123);
   * 
   * // Delete with error handling
   * try {
   *   await user.posts.delete(123);
   *   console.log('Post deleted successfully');
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('Post not found');
   *   } else {
   *     console.error('Error deleting post:', error);
   *   }
   * }
   * 
   * // Delete in relationship chain
   * const user = await User.find(123);
   * await user.posts
   *   .find(456)
   *   .comments
   *   .delete(789);
   * ```
   */
  async delete(id: string | number): Promise<void> {
    this._queryBuilder.method = Methods.DELETE;
    this._queryBuilder.id = id;
    await this.fluentity.adapter.call(this._queryBuilder);
  }

  /**
   * Updates a related model instance by ID.
   * Makes a PUT/PATCH request to update a specific related model.
   * Can use either PUT (full update) or PATCH (partial update).
   *
   * @param id - The ID of the model to update
   * @param data - The data to update the model with
   * @param method - The HTTP method to use (PUT or PATCH)
   * @returns A promise that resolves to the updated model instance
   * @throws {Error} If the update fails
   * @example
   * ```typescript
   * // Full update with PUT
   * const post = await user.posts.update(123, {
   *   title: 'Updated Title',
   *   content: 'Updated content',
   *   status: 'published'
   * });
   * 
   * // Partial update with PATCH
   * const post = await user.posts.update(123, {
   *   title: 'Updated Title'
   * }, Methods.PATCH);
   * 
   * // Update with error handling
   * try {
   *   const post = await user.posts.update(123, {
   *     title: 'Updated Title'
   *   });
   *   console.log('Post updated successfully');
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('Post not found');
   *   } else if (error.status === 422) {
   *     console.log('Validation failed:', error.errors);
   *   } else {
   *     console.error('Error updating post:', error);
   *   }
   * }
   * 
   * // Update in relationship chain
   * const user = await User.find(123);
   * const comment = await user.posts
   *   .find(456)
   *   .comments
   *   .update(789, { content: 'Updated comment' });
   * ```
   */
  async update<A extends Partial<Attributes>>(
    id: string | number,
    data: A,
    method: MethodType = Methods.PUT
  ): Promise<T> {
    this._queryBuilder.method = method;
    this._queryBuilder.id = id;
    this._queryBuilder.body = data;
    const response = await this.fluentity.adapter.call(this._queryBuilder);
    return new (this._relatedModel as any)(response.data, { ...this._queryBuilder });
  }

  /**
   * Fetches a paginated list of related model instances.
   * Makes a GET request with pagination parameters.
   * Combines page number and size into limit/offset parameters.
   *
   * @param page - The page number to fetch (default: 1)
   * @param perPage - The number of items per page (default: 10)
   * @returns A promise that resolves to an array of related model instances
   * @throws {Error} If the request fails
   * @example
   * ```typescript
   * // Get first page with 20 items
   * const posts = await user.posts.paginate(1, 20);
   * 
   * // Get second page with default size
   * const posts = await user.posts.paginate(2);
   * 
   * // Get with filtering
   * const posts = await user.posts
   *   .where({ status: 'published' })
   *   .orderBy('created_at', 'desc')
   *   .paginate(2, 20);
   * 
   * // Paginate with error handling
   * try {
   *   const posts = await user.posts.paginate(2, 20);
   *   console.log(`Found ${posts.length} posts on page 2`);
   * } catch (error) {
   *   console.error('Error fetching posts:', error);
   * }
   * 
   * // Paginate in relationship chain
   * const user = await User.find(123);
   * const comments = await user.posts
   *   .find(456)
   *   .comments
   *   .paginate(2, 20);
   * ```
   */
  async paginate(page = 1, perPage = 10): Promise<T[]> {
    this._queryBuilder.page = page;
    this._queryBuilder.perPage = perPage;
    this._queryBuilder.offset = (page - 1) * perPage;
    this._queryBuilder.limit = perPage;

    const list = await this.fluentity.adapter.call(this._queryBuilder);
    return list?.data?.map((i: any) => new (this._relatedModel as any)(i, { ...this._queryBuilder }));
  }
}
