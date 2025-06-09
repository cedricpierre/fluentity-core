[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / BelongsToMany

# Variable: BelongsToMany()

> `const` **BelongsToMany**: (`model`, `resource?`) => [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md) = `HasMany`

Defined in: [decorators.ts:202](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/decorators.ts#L202)

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
