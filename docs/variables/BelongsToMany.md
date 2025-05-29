[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / BelongsToMany

# Variable: BelongsToMany()

> `const` **BelongsToMany**: (`model`, `resource?`) => [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md) = `HasMany`

Defined in: [decorators.ts:195](https://github.com/cedricpierre/fluentity-core/blob/1e69a8de935352455e2e344f5f8b480e30c89eda/src/decorators.ts#L195)

Alias for HasMany decorator.
Used for better semantic meaning in certain relationship contexts.

Decorator for creating a has-many relationship between models.
Sets up a one-to-many relationship where a model has multiple related models.

## Parameters

### model

() => [`Constructor`](../type-aliases/Constructor.md)\<[`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\>\>

Factory function that returns the related model constructor

### resource?

`string`

Optional custom resource name for the relation

## Returns

[`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md)

A property decorator function

## Example

```typescript
class User {
  @HasMany(() => Post)
  posts: Post[];
}
```

## Example

```typescript
class User {
  @BelongsToMany(() => Role)
  roles: Role[];
}
```
