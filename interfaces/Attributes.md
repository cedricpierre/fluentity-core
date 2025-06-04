[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Attributes

# Interface: Attributes

Defined in: [Model.ts:26](https://github.com/cedricpierre/fluentity-core/blob/0f9d23c0b479e3579d4f9ba1781ac36b1a5404af/src/Model.ts#L26)

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

Defined in: [Model.ts:28](https://github.com/cedricpierre/fluentity-core/blob/0f9d23c0b479e3579d4f9ba1781ac36b1a5404af/src/Model.ts#L28)

Unique identifier for the model instance. Can be either a string or number.
