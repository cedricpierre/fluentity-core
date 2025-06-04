import { Attributes, Model } from './Model';
/**
 * Type representing a constructor function that creates instances of type T.
 * Used for type-safe instantiation of model classes.
 *
 * @template T - The type that the constructor creates
 * @example
 * ```typescript
 * const UserConstructor: Constructor<User> = User;
 * const user = new UserConstructor();
 * ```
 */
export type Constructor<T = any> = new (...args: any[]) => T;
/**
 * Type for property decorator functions.
 * Defines the signature for decorators that modify class properties.
 *
 * @example
 * ```typescript
 * const decorator: PropertyDecoratorType = (target, key) => {
 *   // Modify the property
 * };
 * ```
 */
export type PropertyDecoratorType = (target: object, key: string | symbol) => void;
/**
 * Decorator for casting property values to model instances.
 * Automatically converts plain objects to model instances when accessed.
 *
 * @param caster - Factory function that returns the model constructor to cast to
 * @returns A property decorator function
 * @example
 * ```typescript
 * class User {
 *   @Cast(() => Profile)
 *   profile: Profile;
 * }
 * ```
 */
export declare const Cast: <T extends Model<Attributes>>(caster: () => Constructor<T>) => PropertyDecoratorType;
/**
 * Decorator for creating a has-one relationship between models.
 * Sets up a one-to-one relationship where a model has exactly one related model.
 *
 * @param model - Factory function that returns the related model constructor
 * @param resource - Optional custom resource name for the relation
 * @returns A property decorator function
 * @example
 * ```typescript
 * class User {
 *   @HasOne(() => Profile)
 *   profile: Profile;
 * }
 * ```
 */
export declare const HasOne: (model: () => Constructor<Model<Attributes>>, resource?: string) => PropertyDecoratorType;
/**
 * Decorator for creating a has-many relationship between models.
 * Sets up a one-to-many relationship where a model has multiple related models.
 *
 * @param model - Factory function that returns the related model constructor
 * @param resource - Optional custom resource name for the relation
 * @returns A property decorator function
 * @example
 * ```typescript
 * class User {
 *   @HasMany(() => Post)
 *   posts: Post[];
 * }
 * ```
 */
export declare const HasMany: (model: () => Constructor<Model<Attributes>>, resource?: string) => PropertyDecoratorType;
/**
 * Alias for HasOne decorator.
 * Used for better semantic meaning in certain relationship contexts.
 *
 * @example
 * ```typescript
 * class Post {
 *   @BelongsTo(() => User)
 *   author: User;
 * }
 * ```
 */
export declare const BelongsTo: (model: () => Constructor<Model<Attributes>>, resource?: string) => PropertyDecoratorType;
/**
 * Alias for HasMany decorator.
 * Used for better semantic meaning in certain relationship contexts.
 *
 * @example
 * ```typescript
 * class User {
 *   @BelongsToMany(() => Role)
 *   roles: Role[];
 * }
 * ```
 */
export declare const BelongsToMany: (model: () => Constructor<Model<Attributes>>, resource?: string) => PropertyDecoratorType;
