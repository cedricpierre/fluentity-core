[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / PropertyDecoratorType

# Type Alias: PropertyDecoratorType()

> **PropertyDecoratorType** = (`target`, `key`) => `void`

Defined in: [decorators.ts:30](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/decorators.ts#L30)

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
