[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / HttpRequest

# Class: HttpRequest

Defined in: [adapters/HttpAdapter.ts:218](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/adapters/HttpAdapter.ts#L218)

Represents an HTTP request configuration.

## Implements

- [`HttpRequestInterface`](../interfaces/HttpRequestInterface.md)
- [`AdapterRequest`](../interfaces/AdapterRequest.md)

## Constructors

### Constructor

> **new HttpRequest**(`options?`): `HttpRequest`

Defined in: [adapters/HttpAdapter.ts:225](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/adapters/HttpAdapter.ts#L225)

#### Parameters

##### options?

`Partial`\<[`HttpRequestInterface`](../interfaces/HttpRequestInterface.md)\>

#### Returns

`HttpRequest`

## Properties

### body?

> `optional` **body**: `any`

Defined in: [adapters/HttpAdapter.ts:223](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/adapters/HttpAdapter.ts#L223)

Request body data

#### Implementation of

[`HttpRequestInterface`](../interfaces/HttpRequestInterface.md).[`body`](../interfaces/HttpRequestInterface.md#body)

***

### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"` \| `"HEAD"` \| `"OPTIONS"`

Defined in: [adapters/HttpAdapter.ts:222](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/adapters/HttpAdapter.ts#L222)

HTTP method to use

#### Implementation of

[`HttpRequestInterface`](../interfaces/HttpRequestInterface.md).[`method`](../interfaces/HttpRequestInterface.md#method)

***

### options?

> `optional` **options**: [`HttpRequestOptions`](../interfaces/HttpRequestOptions.md)

Defined in: [adapters/HttpAdapter.ts:221](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/adapters/HttpAdapter.ts#L221)

Request options including method, headers, body, etc.

#### Implementation of

[`HttpRequestInterface`](../interfaces/HttpRequestInterface.md).[`options`](../interfaces/HttpRequestInterface.md#options)

***

### url

> **url**: `string` = `''`

Defined in: [adapters/HttpAdapter.ts:220](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/adapters/HttpAdapter.ts#L220)

The full URL to send the request to

#### Implementation of

[`HttpRequestInterface`](../interfaces/HttpRequestInterface.md).[`url`](../interfaces/HttpRequestInterface.md#url)
