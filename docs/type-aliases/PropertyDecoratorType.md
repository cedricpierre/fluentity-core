[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / PropertyDecoratorType

# Type Alias: PropertyDecoratorType()

> **PropertyDecoratorType** = (`target`, `key`) => `void`

Defined in: [decorators.ts:30](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/decorators.ts#L30)

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
