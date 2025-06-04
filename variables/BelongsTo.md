[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / BelongsTo

# Variable: BelongsTo()

> `const` **BelongsTo**: (`model`, `resource?`) => [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md) = `HasOne`

Defined in: [decorators.ts:181](https://github.com/cedricpierre/fluentity-core/blob/1a5599702fb6e6426747ef36eca57c789075c598/src/decorators.ts#L181)

Alias for HasOne decorator.
Used for better semantic meaning in certain relationship contexts.

Decorator for creating a has-one relationship between models.
Sets up a one-to-one relationship where a model has exactly one related model.

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
  @HasOne(() => Profile)
  profile: Profile;
}
```

## Example

```typescript
class Post {
  @BelongsTo(() => User)
  author: User;
}
```
