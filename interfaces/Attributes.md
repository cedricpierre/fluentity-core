[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Attributes

# Interface: Attributes

Defined in: [Model.ts:25](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/Model.ts#L25)

Base interface for model attributes that all models must implement.
Provides the basic structure for model data and allows for dynamic properties.
All model attributes must extend this interface to ensure type safety.

## Example

```typescript
interface UserAttributes extends Attributes {
  name: string;
  email: string;
  age?: number;
  // Dynamic properties are allowed
  [key: string]: any;
}
```

## Indexable

\[`key`: `string`\]: `any`

Index signature allowing for dynamic properties of any type

## Properties

### id?

> `optional` **id**: `string` \| `number`

Defined in: [Model.ts:27](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/Model.ts#L27)

Unique identifier for the model instance. Can be either a string or number.
