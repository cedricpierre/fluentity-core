[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / PropertyDecoratorType

# Type Alias: PropertyDecoratorType()

> **PropertyDecoratorType** = (`target`, `key`) => `void`

Defined in: [decorators.ts:30](https://github.com/cedricpierre/fluentity-core/blob/aee04245ff8d14d39d656c297dc78341d529dae2/src/decorators.ts#L30)

Type for property decorator functions.
Defines the signature for decorators that modify class properties.

## Parameters

### target

`object`

### key

`string` | `symbol`

## Returns

`void`

## Example

```typescript
const decorator: PropertyDecoratorType = (target, key) => {
  // Modify the property
};
```
