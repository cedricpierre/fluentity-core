import { RelationBuilder } from './RelationBuilder';
import { Attributes, Model } from './Model';
import { HasManyRelationBuilder } from './HasManyRelationBuilder';
import { HasOneRelationBuilder } from './HasOneRelationBuilder';

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
 * Creates a relation decorator that sets up a relationship between models.
 * Internal factory function used by HasOne and HasMany decorators.
 *
 * @template T - The type of model to create a relation for
 * @template R - The type of relation builder to use
 * @param model - Factory function that returns the related model constructor
 * @param relationBuilderFactory - Constructor for the appropriate relation builder
 * @param resource - Optional custom resource name for the relation
 * @returns A property decorator function
 * @private
 */
const makeRelation = <T extends Model<Attributes>, R extends RelationBuilder<T>>(
  model: () => Constructor<T>,
  relationBuilderFactory: Constructor<R>,
  resource?: string
): PropertyDecoratorType => {
  return function (target: object, key: string | symbol): void {
    // Initialize the property on the prototype
    Object.defineProperty(target, key, {
      get(this: Model<Attributes>) {
        return new relationBuilderFactory(model(), this.queryBuilder, resource);
      },
      set(this: Model<Attributes>, value: any) {
        
      },
      enumerable: true,
      configurable: true,
    });
  };
};

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
export const Cast = <T extends Model<Attributes>>(
  caster: () => Constructor<T>
): PropertyDecoratorType => {
  return function (target: object, key: string | symbol): void {
    // Create a unique symbol for each instance
    const privateKey = Symbol(String(key));

    // Initialize the property on the prototype
    Object.defineProperty(target, key, {
      get(this: any) {
        if (!this[privateKey]) {
          this[privateKey] = undefined;
        }
        const value = this[privateKey];
        if (!value) return value;

        const ModelClass = caster();
        if (!ModelClass) return value;

        if (Array.isArray(value)) {
          return value.map(item => (item instanceof ModelClass ? item : new ModelClass(item)));
        } else if (value instanceof ModelClass) {
          return value;
        } else {
          return new ModelClass(value);
        }
      },
      set(this: any, value: any) {
        const ModelClass = caster();
        if (!ModelClass) {
          this[privateKey] = value;
          return;
        }

        if (Array.isArray(value)) {
          this[privateKey] = value.map(item =>
            item instanceof ModelClass ? item : new ModelClass(item)
          );
        } else if (value instanceof ModelClass) {
          this[privateKey] = value;
        } else {
          this[privateKey] = new ModelClass(value);
        }
      },
      enumerable: true,
      configurable: true,
    });
  };
};

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
export const HasOne = (
  model: () => Constructor<Model<Attributes>>,
  resource?: string
): PropertyDecoratorType => {
  return makeRelation(model, HasOneRelationBuilder as Constructor<RelationBuilder<any>>, resource);
};

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
export const HasMany = (
  model: () => Constructor<Model<Attributes>>,
  resource?: string
): PropertyDecoratorType => {
  return makeRelation(model, HasManyRelationBuilder as Constructor<RelationBuilder<any>>, resource);
};

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
export const BelongsTo = HasOne;

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
export const BelongsToMany = HasMany;
