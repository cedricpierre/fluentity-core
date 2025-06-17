[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / HttpResponse

# Class: HttpResponse\<T\>

Defined in: [adapters/HttpAdapter.ts:236](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L236)

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

`T` = `any`

## Implements

- [`HttpResponseInterface`](../interfaces/HttpResponseInterface.md)
- [`AdapterResponse`](../interfaces/AdapterResponse.md)\<`T`\>

## Constructors

### Constructor

> **new HttpResponse**\<`T`\>(`options?`): `HttpResponse`\<`T`\>

Defined in: [adapters/HttpAdapter.ts:239](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L239)

#### Parameters

##### options?

`Partial`\<[`HttpResponseInterface`](../interfaces/HttpResponseInterface.md)\>

#### Returns

`HttpResponse`\<`T`\>

## Properties

### data

> **data**: `T`

Defined in: [adapters/HttpAdapter.ts:237](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L237)

The response data from the API

#### Implementation of

[`AdapterResponse`](../interfaces/AdapterResponse.md).[`data`](../interfaces/AdapterResponse.md#data)
