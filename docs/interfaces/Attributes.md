[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Attributes

# Interface: Attributes

Defined in: [Model.ts:21](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L21)

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

Defined in: [Model.ts:23](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L23)

Unique identifier for the model instance. Can be either a string or number.
