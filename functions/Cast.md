[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Cast

# Function: Cast()

> **Cast**\<`T`\>(`caster`): [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md)

Defined in: [decorators.ts:78](https://github.com/cedricpierre/fluentity-core/blob/dd49dcf5b1debdac859ec47df4dfdcbe1a5885d8/src/decorators.ts#L78)

Decorator for casting property values to model instances.
Automatically converts plain objects to model instances when accessed.

## Type Parameters

### T

`T` *extends* [`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\>

## Parameters

### caster

() => [`Constructor`](../type-aliases/Constructor.md)\<`T`\>

Factory function that returns the model constructor to cast to

## Returns

[`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md)

A property decorator function

## Example

```typescript
class User {
  @Cast(() => Profile)
  profile: Profile;
}
```
