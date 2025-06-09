[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / AdapterResponse

# Interface: AdapterResponse\<T\>

Defined in: [Fluentity.ts:87](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/Fluentity.ts#L87)

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

Defined in: [Fluentity.ts:89](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/Fluentity.ts#L89)

The response data from the API
