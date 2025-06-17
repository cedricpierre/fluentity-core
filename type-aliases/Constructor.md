[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Constructor

# Type Alias: Constructor()\<T\>

> **Constructor**\<`T`\> = (...`args`) => `T`

Defined in: [decorators.ts:17](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/decorators.ts#L17)

Type representing a constructor function that creates instances of type T.
Used for type-safe instantiation of model classes.

## Type Parameters

### T

`T` = `any`

The type that the constructor creates

## Parameters

### args

...`any`[]

## Returns

`T`

## Example

```typescript
const UserConstructor: Constructor<User> = User;
const user = new UserConstructor();
```
