[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / HasMany

# Function: HasMany()

> **HasMany**(`model`, `resource?`): [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md)

Defined in: [decorators.ts:179](https://github.com/cedricpierre/fluentity-core/blob/b057ffa4bd984b3647369856bae4096d23d452af/src/decorators.ts#L179)

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
