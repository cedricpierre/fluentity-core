[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / PropertyDecoratorType

# Type Alias: PropertyDecoratorType()

> **PropertyDecoratorType** = (`target`, `key`) => `void`

Defined in: [decorators.ts:30](https://github.com/cedricpierre/fluentity-core/blob/37e0fe495327dcf7f6b167ed5958ed95c676e957/src/decorators.ts#L30)

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
