[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / RestAdapter

# Class: RestAdapter

Defined in: [adapters/RestAdapter.ts:8](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/RestAdapter.ts#L8)

A static HTTP client class that provides methods for making HTTP requests with built-in caching,
interceptors, and request/response handling capabilities.

## Extends

- `HttpAdapter`

## Constructors

### Constructor

> **new RestAdapter**(`options`): `RestAdapter`

Defined in: [adapters/RestAdapter.ts:15](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/RestAdapter.ts#L15)

Constructor for the RestAdapter class.

#### Parameters

##### options

`Partial`\<[`RestAdapterOptions`](../interfaces/RestAdapterOptions.md)\>

Partial configuration options to merge with existing options

#### Returns

`RestAdapter`

#### Overrides

`HttpAdapter.constructor`

## Properties

### options

> **options**: [`RestAdapterOptions`](../interfaces/RestAdapterOptions.md)

Defined in: [adapters/RestAdapter.ts:9](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/RestAdapter.ts#L9)

#### Overrides

`HttpAdapter.options`

## Accessors

### request

#### Get Signature

> **get** **request**(): `HttpRequest`

Defined in: [adapters/HttpAdapter.ts:59](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L59)

The request object.

##### Returns

`HttpRequest`

#### Inherited from

`HttpAdapter.request`

## Methods

### call()

> **call**(`queryBuilder`): `Promise`\<`HttpResponse`\<`any`\>\>

Defined in: [adapters/HttpAdapter.ts:78](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L78)

Makes an HTTP request to the specified URL with optional request options.
Handles caching, interceptors, and error handling.

#### Parameters

##### queryBuilder

[`QueryBuilder`](QueryBuilder.md)

Optional request configuration

#### Returns

`Promise`\<`HttpResponse`\<`any`\>\>

A promise that resolves to the response data

#### Throws

Error if baseUrl is not configured or if the request fails

#### Inherited from

`HttpAdapter.call`

***

### clearCache()

> **clearCache**(): `this`

Defined in: [adapters/HttpAdapter.ts:66](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L66)

Clears all cached responses.

#### Returns

`this`

#### Inherited from

`HttpAdapter.clearCache`

***

### configure()

> **configure**(`options`): `this`

Defined in: [adapters/HttpAdapter.ts:51](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L51)

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
