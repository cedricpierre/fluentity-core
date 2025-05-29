[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / HasOne

# Function: HasOne()

> **HasOne**(`model`, `resource?`): [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md)

Defined in: [decorators.ts:140](https://github.com/cedricpierre/fluentity-core/blob/1e69a8de935352455e2e344f5f8b480e30c89eda/src/decorators.ts#L140)

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
