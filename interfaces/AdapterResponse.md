[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / AdapterResponse

# Interface: AdapterResponse\<T\>

Defined in: [Fluentity.ts:87](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/Fluentity.ts#L87)

Interface for adapter responses.
Contains the response data from the API.

## Example

```typescript
// For a single object response
const response: AdapterResponse<User> = {
  data: { id: 1, name: 'John' }
};

// For an array response
const response: AdapterResponse<User[]> = {
  data: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
};
```

## Type Parameters

### T

`T` = `unknown` \| `any`

## Properties

### data

> **data**: `T`

Defined in: [Fluentity.ts:89](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/Fluentity.ts#L89)

The response data from the API
