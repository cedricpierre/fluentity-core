[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / HttpAdapter

# Class: `abstract` HttpAdapter

Defined in: [adapters/HttpAdapter.ts:46](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L46)

A static HTTP client class that provides methods for making HTTP requests with built-in caching,
interceptors, and request/response handling capabilities.

## Extended by

- [`RestAdapter`](RestAdapter.md)
- [`GraphqlAdapter`](GraphqlAdapter.md)

## Implements

- [`AdapterInterface`](../interfaces/AdapterInterface.md)

## Constructors

### Constructor

> **new HttpAdapter**(`options`): `HttpAdapter`

Defined in: [adapters/HttpAdapter.ts:75](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L75)

Constructor for the HttpAdapter class.

#### Parameters

##### options

`Partial`\<[`HttpAdapterOptions`](../interfaces/HttpAdapterOptions.md)\<`any`\>\>

Partial configuration options to merge with existing options

#### Returns

`HttpAdapter`

#### Throws

If baseUrl is not provided

## Properties

### options

> **options**: [`HttpAdapterOptions`](../interfaces/HttpAdapterOptions.md)

Defined in: [adapters/HttpAdapter.ts:49](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L49)

The options for the adapter.
Contains configuration settings specific to the adapter implementation.

#### Implementation of

[`AdapterInterface`](../interfaces/AdapterInterface.md).[`options`](../interfaces/AdapterInterface.md#options)

## Accessors

### request

#### Get Signature

> **get** **request**(): [`HttpRequest`](HttpRequest.md)

Defined in: [adapters/HttpAdapter.ts:93](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L93)

The request object.

##### Returns

[`HttpRequest`](HttpRequest.md)

## Methods

### call()

> **call**(`queryBuilder`): `Promise`\<[`HttpResponse`](HttpResponse.md)\<`any`\>\>

Defined in: [adapters/HttpAdapter.ts:112](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L112)

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

#### Implementation of

[`AdapterInterface`](../interfaces/AdapterInterface.md).[`call`](../interfaces/AdapterInterface.md#call)

***

### clearCache()

> **clearCache**(): `this`

Defined in: [adapters/HttpAdapter.ts:100](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L100)

Clears all cached responses.

#### Returns

`this`

***

### configure()

> **configure**(`options`): `this`

Defined in: [adapters/HttpAdapter.ts:83](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L83)

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

#### Implementation of

[`AdapterInterface`](../interfaces/AdapterInterface.md).[`configure`](../interfaces/AdapterInterface.md#configure)
