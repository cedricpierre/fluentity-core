[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Attributes

# Interface: Attributes

Defined in: [Model.ts:13](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L13)

Base interface for model attributes that all models must implement.
Provides the basic structure for model data and allows for dynamic properties.

## Indexable

\[`key`: `string`\]: `any`

Index signature allowing for dynamic properties of any type

## Properties

### id?

> `optional` **id**: `string` \| `number`

Defined in: [Model.ts:15](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L15)

Unique identifier for the model instance. Can be either a string or number.
