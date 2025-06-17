[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / RestAdapter

# Class: RestAdapter

Defined in: [adapters/RestAdapter.ts:8](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/RestAdapter.ts#L8)

A static HTTP client class that provides methods for making HTTP requests with built-in caching,
interceptors, and request/response handling capabilities.

## Extends

- [`HttpAdapter`](HttpAdapter.md)

## Constructors

### Constructor

> **new RestAdapter**(`options`): `RestAdapter`

Defined in: [adapters/RestAdapter.ts:15](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/RestAdapter.ts#L15)

Constructor for the RestAdapter class.

#### Parameters

##### options

`Partial`\<[`RestAdapterOptions`](../interfaces/RestAdapterOptions.md)\>

Partial configuration options to merge with existing options

#### Returns

`RestAdapter`

#### Overrides

[`HttpAdapter`](HttpAdapter.md).[`constructor`](HttpAdapter.md#constructor)

## Properties

### options

> **options**: [`RestAdapterOptions`](../interfaces/RestAdapterOptions.md)

Defined in: [adapters/RestAdapter.ts:9](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/RestAdapter.ts#L9)

The options for the adapter.
Contains configuration settings specific to the adapter implementation.

#### Overrides

[`HttpAdapter`](HttpAdapter.md).[`options`](HttpAdapter.md#options)

## Accessors

### request

#### Get Signature

> **get** **request**(): [`HttpRequest`](HttpRequest.md)

Defined in: [adapters/HttpAdapter.ts:93](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L93)

The request object.

##### Returns

[`HttpRequest`](HttpRequest.md)

#### Inherited from

[`HttpAdapter`](HttpAdapter.md).[`request`](HttpAdapter.md#request)

## Methods

### call()

> **call**(`queryBuilder`): `Promise`\<[`HttpResponse`](HttpResponse.md)\<`any`\>\>

Defined in: [adapters/HttpAdapter.ts:112](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L112)

Makes an HTTP request to the specified URL with optional request options.
Handles caching, interceptors, and error handling.

#### Parameters

##### queryBuilder

[`QueryBuilder`](QueryBuilder.md)

Optional request configuration

#### Returns

`Promise`\<[`HttpResponse`](HttpResponse.md)\<`any`\>\>

A promise that resolves to the response data

#### Throws

Error if baseUrl is not configured or if the request fails

#### Inherited from

[`HttpAdapter`](HttpAdapter.md).[`call`](HttpAdapter.md#call)

***

### clearCache()

> **clearCache**(): `this`

Defined in: [adapters/HttpAdapter.ts:100](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L100)

Clears all cached responses.

#### Returns

`this`

#### Inherited from

[`HttpAdapter`](HttpAdapter.md).[`clearCache`](HttpAdapter.md#clearcache)

***

### configure()

> **configure**(`options`): `this`

Defined in: [adapters/HttpAdapter.ts:83](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L83)

Configures the adapter with additional options.

#### Parameters

##### options

`Partial`\<[`HttpAdapterOptions`](../interfaces/HttpAdapterOptions.md)\<`any`\>\>

The configuration options to apply

#### Returns

`this`

#### Example

```typescript
adapter.configure({
  baseURL: 'https://api.example.com',
  timeout: 5000
});
```

#### Inherited from

[`HttpAdapter`](HttpAdapter.md).[`configure`](HttpAdapter.md#configure)
