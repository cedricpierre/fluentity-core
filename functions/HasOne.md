[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / HasOne

# Function: HasOne()

> **HasOne**(`model`, `resource?`): [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md)

Defined in: [decorators.ts:143](https://github.com/cedricpierre/fluentity-core/blob/768ceed3962a4ca4f908cd1b97071617753a9137/src/decorators.ts#L143)

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
