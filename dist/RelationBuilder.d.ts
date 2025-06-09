import { Attributes, Model } from './Model';
import { QueryBuilder } from './QueryBuilder';
import { HasManyRelationBuilder } from './HasManyRelationBuilder';
import { HasOneRelationBuilder } from './HasOneRelationBuilder';
import { Fluentity } from './Fluentity';
import { RestAdapter } from './adapters/RestAdapter';
/**
 * Type that determines the appropriate relation builder or model instance based on the model type.
 * Maps model types to their corresponding relation builder types or model instances:
 * - Single model -> HasOneRelationBuilder<T> | T
 * - Array of models -> HasManyRelationBuilder<T[number]> | T[]
 *
 * This type is used internally to ensure type safety when working with relationships.
 *
 * @template T - The model type to determine the relation type for
 * @example
 * ```typescript
 * // Has-one relationship
 * type UserProfile = Relation<Profile>; // HasOneRelationBuilder<Profile> | Profile
 *
 * // Has-many relationship
 * type UserPosts = Relation<Post[]>; // HasManyRelationBuilder<Post> | Post[]
 *
 * // Usage in model definitions
 * class User extends Model {
 *   @HasOne(() => Profile)
 *   profile: Relation<Profile>;
 *
 *   @HasMany(() => Post)
 *   posts: Relation<Post[]>;
 * }
 * ```
 */
export type Relation<T> = T extends Model<Attributes> ? HasOneRelationBuilder<T> | T : T extends Array<Model<Attributes>> ? HasManyRelationBuilder<T[number]> | T : never;
/**
 * Base class for building and managing relationships between models.
 * Provides methods for querying related models and building API requests.
 * This class is extended by HasOneRelationBuilder and HasManyRelationBuilder
 * to implement specific relationship behaviors.
 *
 * Features:
 * - Query building and filtering
 * - Sorting and pagination
 * - Relationship traversal
 * - Custom query scopes
 *
 * @template T - The type of model this relation builder works with
 * @example
 * ```typescript
 * // Basic usage with a has-one relationship
 * class UserProfile extends RelationBuilder<Profile> {
 *   // Custom relationship logic
 * }
 *
 * // Usage with query building
 * const posts = await user.posts
 *   .where({ status: 'published' })
 *   .orderBy('created_at', 'desc')
 *   .limit(10)
 *   .all();
 * ```
 */
export declare class RelationBuilder<T extends Model<Attributes>> {
    #private;
    /**
     * Creates a new relation builder instance.
     * Sets up the query builder and configures the resource path.
     * Handles inheritance of parent query parameters and custom scopes.
     *
     * @param model - The model instance to build relations for
     * @param queryBuilder - Query builder instance for constructing API requests
     * @param resource - Optional custom resource name for the relation
     * @throws {Error} If the model or query builder is invalid
     * @example
     * ```typescript
     * // Create a basic relation builder
     * const builder = new RelationBuilder(User, new QueryBuilder());
     *
     * // Create with custom resource
     * const builder = new RelationBuilder(User, new QueryBuilder(), 'custom-users');
     *
     * // Create with parent query
     * const parentQuery = new QueryBuilder().where({ active: true });
     * const builder = new RelationBuilder(User, parentQuery);
     * ```
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
    protected get fluentity(): Fluentity<RestAdapter>;
    protected get queryBuilder(): QueryBuilder;
    protected get relatedModel(): T;
    /**
     * Gets a model instance by ID without making an API request.
     * Creates a new model instance with the given ID for local operations.
     * Useful for setting up relationships or references.
     *
     * @param id - The ID of the model to get
     * @returns A new model instance with the given ID
     * @example
     * ```typescript
     * // Get a reference to a post
     * const post = user.posts.id(123);
     *
     * // Use in relationship setup
     * const comment = await Comment.create({
     *   content: 'Great post!',
     *   post: user.posts.id(123)
     * });
     * ```
     */
    id(id: string | number): T;
    /**
     * Fetches a model instance by ID from the API.
     * Makes a GET request to retrieve the model data.
     * Throws an error if the model is not found.
     *
     * @param id - The ID of the model to fetch
     * @returns A promise that resolves to the fetched model instance
     * @throws {Error} If the model is not found
     * @example
     * ```typescript
     * // Fetch a post by ID
     * const post = await user.posts.find(123);
     *
     * // Fetch with error handling
     * try {
     *   const post = await user.posts.find(123);
     *   console.log(`Found post: ${post.title}`);
     * } catch (error) {
     *   if (error.status === 404) {
     *     console.log('Post not found');
     *   } else {
     *     console.error('Error fetching post:', error);
     *   }
     * }
     * ```
     */
    find(id: string | number): Promise<T>;
    /**
     * Adds a where clause to the query.
     * Filters results based on exact field-value matches.
     * Multiple calls to where() will merge the conditions.
     *
     * @param where - Object containing field-value pairs to filter by
     * @returns The relation builder instance for method chaining
     * @example
     * ```typescript
     * // Simple equality conditions
     * const posts = await user.posts
     *   .where({ status: 'published' })
     *   .all();
     *
     * // Multiple conditions
     * const posts = await user.posts
     *   .where({
     *     status: 'published',
     *     type: 'article',
     *     featured: true
     *   })
     *   .all();
     *
     * // Multiple where calls
     * const posts = await user.posts
     *   .where({ status: 'published' })
     *   .where({ type: 'article' })
     *   .all();
     * ```
     */
    where(where: Record<string, any>): RelationBuilder<T>;
    /**
     * Adds filter conditions to the query.
     * Supports more complex filtering operations than where().
     * Can handle comparison operators, arrays, and nested conditions.
     *
     * @param filters - Object containing filter conditions
     * @returns The relation builder instance for method chaining
     * @example
     * ```typescript
     * // Comparison operators
     * const posts = await user.posts
     *   .filter({
     *     views: { gt: 1000 },
     *     rating: { gte: 4.5 }
     *   })
     *   .all();
     *
     * // Array conditions
     * const posts = await user.posts
     *   .filter({
     *     tags: { in: ['featured', 'popular'] },
     *     status: ['published', 'draft']
     *   })
     *   .all();
     *
     * // Nested conditions
     * const posts = await user.posts
     *   .filter({
     *     author: {
     *       role: 'admin',
     *       status: 'active'
     *     }
     *   })
     *   .all();
     * ```
     */
    filter(filters: Record<string, any>): RelationBuilder<T>;
    /**
     * Adds an order by clause to the query.
     * Sorts the results by the specified field and direction.
     * Multiple calls to orderBy() will use the last one.
     *
     * @param sort - The field to order by (default: 'id')
     * @param direction - The direction to order in ('asc' or 'desc', default: 'asc')
     * @returns The relation builder instance for method chaining
     * @example
     * ```typescript
     * // Sort by single field
     * const posts = await user.posts
     *   .orderBy('created_at', 'desc')
     *   .all();
     *
     * // Sort by multiple fields
     * const posts = await user.posts
     *   .orderBy('status', 'asc')
     *   .orderBy('created_at', 'desc')
     *   .all();
     *
     * // Default sorting
     * const posts = await user.posts
     *   .orderBy() // Sorts by 'id' in ascending order
     *   .all();
     * ```
     */
    orderBy(sort?: string, direction?: string): RelationBuilder<T>;
    /**
     * Limits the number of results returned.
     * Restricts the query to return at most n results.
     * Useful for pagination or limiting large result sets.
     *
     * @param n - The maximum number of results to return
     * @returns The relation builder instance for method chaining
     * @example
     * ```typescript
     * // Get only 10 posts
     * const posts = await user.posts
     *   .limit(10)
     *   .all();
     *
     * // Use with pagination
     * const posts = await user.posts
     *   .limit(20)
     *   .offset(40) // Get posts 41-60
     *   .all();
     * ```
     */
    limit(n: number): RelationBuilder<T>;
    /**
     * Sets the offset for pagination in the query results.
     * Skips n records before starting to return results.
     * Often used with limit() for pagination.
     *
     * @param n - The number of records to skip
     * @returns The relation builder instance for method chaining
     * @example
     * ```typescript
     * // Skip first 20 posts
     * const posts = await user.posts
     *   .offset(20)
     *   .all();
     *
     * // Use with limit for pagination
     * const posts = await user.posts
     *   .limit(10)
     *   .offset(30) // Get posts 31-40
     *   .all();
     * ```
     */
    offset(n: number): RelationBuilder<T>;
}
