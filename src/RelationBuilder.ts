import { Attributes, Model } from './Model';
import { QueryBuilder } from './QueryBuilder';
import { HasManyRelationBuilder } from './HasManyRelationBuilder';
import { HasOneRelationBuilder } from './HasOneRelationBuilder';
import { Fluentity, Methods } from './index';
import { RestAdapter } from './adapters/RestAdapter';

/**
 * Type that determines the appropriate relation builder or model instance based on the model type.
 * Maps model types to their corresponding relation builder types or model instances:
 * - Single model -> HasOneRelationBuilder<T> | T
 * - Array of models -> HasManyRelationBuilder<T> | T[]
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
export type Relation<T extends Model<Attributes> | Array<Model<Attributes>>> = T extends Array<infer U extends Model<Attributes>>
    ? HasManyRelationBuilder<U>
    : T extends Model<Attributes>
        ? HasOneRelationBuilder<T>
        : never;
    
/**
 * Type that determines the appropriate data type based on the relation builder type.
 * Returns T if the builder is a HasOneRelationBuilder, otherwise returns T[].
 * 
 * @template T - The model type
 * @template B - The relation builder type (defaults to RelationBuilder<T>)
 * @example
 * ```typescript
 * // For has-one relationships
 * type ProfileData = RelationData<Profile>; // Profile
 * 
 * // For has-many relationships
 * type PostsData = RelationData<Post>; // Post[]
 * ```
 */
export type RelationData<T extends Model<Attributes>, B extends RelationBuilder<T> = RelationBuilder<T>> = 
  B extends HasOneRelationBuilder<T> ? T : T[];

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
export class RelationBuilder<T extends Model<Attributes>> {
  /**
   * Query builder instance for constructing API URLs and managing query parameters.
   * Used internally to build the request URL and parameters.
   * @private
   */
   #queryBuilder: QueryBuilder;

  /**
   * The related model instance that this builder operates on.
   * Used to create new instances of the related model.
   * @private
   */
   #relatedModel: T;

  /**
   * The data associated with this relation builder.
   * Returns T[] if T is an array type, otherwise returns T.
   * @private
   */
  #data!: RelationData<T, this>;

  /**
   * Creates a new relation builder instance.
   * Sets up the query builder and configures the resource path.
   * Handles inheritance of parent query parameters and custom scopes.
   *
   * @param model - The model instance to build relations for
   * @param parentQuery - Query builder instance for constructing API requests
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
  constructor(model: T, parentQuery?: QueryBuilder) {
    this.#relatedModel = model;
    this.#queryBuilder = new QueryBuilder({
      model: this.#relatedModel as unknown as typeof Model,
    });

    if (parentQuery) {
      this.#queryBuilder.parent = { ...parentQuery } as QueryBuilder;
    }

    if (this.#relatedModel.scopes) {
      Object.entries(this.#relatedModel.scopes).forEach(([name, scope]) => {
        (this as any)[name] = (...args: any[]) => {
          return (scope as any)(this, ...args) as RelationBuilder<T>;
        };
      });
    }
  }

  /**
   * Type definition for dynamic scope methods that can be added at runtime.
   * Allows for custom query scopes to be added to the builder.
   */
  [key: string]: any;

  /**
   * Gets the data associated with this relation builder.
   * Returns T[] if T is an array type, otherwise returns T.
   * @public
   */
  get data(): RelationData<T, this> {
    return this.#data;
  }

  /**
   * Sets the data associated with this relation builder.
   * @param value - The data to set
   */
  set data(value: RelationData<T, this>) {
    this.#data = value;
  }

  /**
   * Gets the Fluentity instance for making API requests.
   * Provides access to the singleton instance that manages API communication.
   *
   * @protected
   * @returns The singleton Fluentity instance
   * @throws {Error} If Fluentity has not been initialized
   */
  protected get fluentity(): Fluentity<RestAdapter> {
    return Fluentity.getInstance<RestAdapter>();
  }

  /**
   * Gets the query builder instance for constructing API URLs and managing query parameters.
   * @protected
   * @returns The query builder instance
   */
  protected get queryBuilder(): QueryBuilder {
    return this.#queryBuilder;
  }

  /**
   * Gets the related model instance that this builder operates on.
   * @protected
   * @returns The related model instance
   */
  protected get relatedModel(): T {
    return this.#relatedModel;
  }

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
  id(id: string | number): T {
    this.#queryBuilder.id = id;
    return new (this.#relatedModel as any)({ id }, this.#queryBuilder);
  }

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
  async find(id: string | number): Promise<T> {
    this.#queryBuilder.id = id;
    this.#queryBuilder.method = Methods.GET;

    const response = await this.fluentity.adapter.call(this.#queryBuilder);
    const model = new (this.#relatedModel as any)(response.data, this.#queryBuilder);
    model.queryBuilder.id = id;
    return model;
  }

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
  where(where: Record<string, any>): RelationBuilder<T> {
    this.#queryBuilder.where(where);
    return this;
  }

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
  filter(filters: Record<string, any>): RelationBuilder<T> {
    this.#queryBuilder.filter(filters);
    return this;
  }

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
  orderBy(sort: string = 'id', direction: string = 'asc'): RelationBuilder<T> {
    this.#queryBuilder.sort = sort;
    this.#queryBuilder.direction = direction;
    return this;
  }

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
  limit(n: number): RelationBuilder<T> {
    this.#queryBuilder.limit = n;
    return this;
  }

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
  offset(n: number): RelationBuilder<T> {
    this.#queryBuilder.offset = n;
    return this;
  }
}
