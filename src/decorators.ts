import { RelationBuilder } from './RelationBuilder'
import { Model } from './Model'
import { HasManyRelationBuilder } from './HasManyRelationBuilder';
import { HasOneRelationBuilder } from './HasOneRelationBuilder';

/**
 * Type representing a constructor function that creates instances of type T.
 * @template T - The type that the constructor creates
 */
export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Type for property decorator functions.
 */
export type PropertyDecoratorType = (target: Object, key: string | symbol) => void;

/**
 * Creates a relation decorator that sets up a relationship between models.
 * @param modelFactory - Factory function that returns the related model constructor
 * @param relationBuilderFactory - Constructor for the appropriate relation builder
 * @param resource - Optional custom resource name for the relation
 * @returns A property decorator function
 */
const makeRelation = (
    modelFactory: () => Constructor<Model<any>>,
    relationBuilderFactory: Constructor<RelationBuilder<any>>,
    resource?: string
): PropertyDecoratorType => {
    return function (target: Object, key: string | symbol): void {
        // Initialize the property on the prototype
        Object.defineProperty(target, key, {
            get(this: Model<any>) {
                const path = (this.path ? `${this.path}/` : '') + (resource ?? String(key))

                return new relationBuilderFactory(
                    modelFactory,
                    undefined,
                    path
                );
            },
            enumerable: true,
            configurable: true,
        });
    }
}

export const Cast = (caster: () => Constructor<any>): PropertyDecoratorType => {
    return function (target: Object, key: string | symbol): void {
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
                    return value.map(item => item instanceof ModelClass ? item : new ModelClass(item));
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
                    this[privateKey] = value.map(item => item instanceof ModelClass ? item : new ModelClass(item));
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
 * @param model - Factory function that returns the related model constructor
 * @param resource - Optional custom resource name for the relation
 * @returns A property decorator function
 */
export const HasOne = (model: () => Constructor<Model<any>>, resource?: string): PropertyDecoratorType => {
    return makeRelation(model, HasOneRelationBuilder as Constructor<RelationBuilder<any>>, resource);
}

/**
 * Decorator for creating a has-many relationship between models.
 * @param model - Factory function that returns the related model constructor
 * @param resource - Optional custom resource name for the relation
 * @returns A property decorator function
 */
export const HasMany = (model: () => Constructor<Model<any>>, resource?: string): PropertyDecoratorType => {
    return makeRelation(model, HasManyRelationBuilder as Constructor<RelationBuilder<any>>, resource);
}

export const BelongsTo = HasOne;
export const BelongsToMany = HasMany;