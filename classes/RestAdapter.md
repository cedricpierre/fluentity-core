[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / RestAdapter

# Class: RestAdapter

Defined in: [adapters/RestAdapter.ts:8](https://github.com/cedricpierre/fluentity-core/blob/c320ba12f5df20a74e195f3fa6edef8576093d87/src/adapters/RestAdapter.ts#L8)

A static HTTP client class that provides methods for making HTTP requests with built-in caching,
interceptors, and request/response handling capabilities.

## Extends

- `HttpAdapter`

## Constructors

### Constructor

> **new RestAdapter**(`options`): `RestAdapter`

Defined in: [adapters/RestAdapter.ts:13](https://github.com/cedricpierre/fluentity-core/blob/c320ba12f5df20a74e195f3fa6edef8576093d87/src/adapters/RestAdapter.ts#L13)

Constructor for the RestAdapter class.

#### Parameters

##### options

`Partial`\<[`RestAdapterOptions`](../type-aliases/RestAdapterOptions.md)\>

Partial configuration options to merge with existing options

#### Returns

`RestAdapter`

#### Overrides

`HttpAdapter.constructor`

## Properties

### options

> **options**: `HttpAdapterOptions`

Defined in: [adapters/HttpAdapter.ts:19](https://github.com/cedricpierre/fluentity-core/blob/c320ba12f5df20a74e195f3fa6edef8576093d87/src/adapters/HttpAdapter.ts#L19)

The options for the adapter.
Contains configuration settings specific to the adapter implementation.

#### Inherited from

`HttpAdapter.options`

## Accessors

### url

#### Get Signature

> **get** **url**(): `string`

Defined in: [adapters/HttpAdapter.ts:49](https://github.com/cedricpierre/fluentity-core/blob/c320ba12f5df20a74e195f3fa6edef8576093d87/src/adapters/HttpAdapter.ts#L49)

##### Returns

`string`

#### Inherited from

`HttpAdapter.url`

## Methods

### call()

> **call**(`queryBuilder`): `Promise`\<`HttpResponse`\<`unknown`\>\>

Defined in: [adapters/HttpAdapter.ts:69](https://github.com/cedricpierre/fluentity-core/blob/c320ba12f5df20a74e195f3fa6edef8576093d87/src/adapters/HttpAdapter.ts#L69)

Makes an HTTP request to the specified URL with optional request options.
Handles caching, interceptors, and error handling.

#### Parameters

##### queryBuilder

[`QueryBuilder`](QueryBuilder.md)

Optional request configuration

#### Returns

`Promise`\<`HttpResponse`\<`unknown`\>\>

A promise that resolves to the response data

#### Throws

Error if baseUrl is not configured or if the request fails

#### Inherited from

`HttpAdapter.call`

***

### clearCache()

> **clearCache**(): `this`

Defined in: [adapters/HttpAdapter.ts:56](https://github.com/cedricpierre/fluentity-core/blob/c320ba12f5df20a74e195f3fa6edef8576093d87/src/adapters/HttpAdapter.ts#L56)

Clears all cached responses.

#### Returns

`this`

#### Inherited from

`HttpAdapter.clearCache`

***

### configure()

> **configure**(`options`): `this`

Defined in: [adapters/HttpAdapter.ts:44](https://github.com/cedricpierre/fluentity-core/blob/c320ba12f5df20a74e195f3fa6edef8576093d87/src/adapters/HttpAdapter.ts#L44)

Configures the adapter with additional options.

#### Parameters

##### options

`Partial`\<`HttpAdapterOptions`\<`any`\>\>

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

`HttpAdapter.configure`
