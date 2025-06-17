[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / HttpAdapterOptions

# Interface: HttpAdapterOptions\<T\>

Defined in: [adapters/HttpAdapter.ts:177](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L177)

Configuration options for the HttpClient.

## Extends

- [`AdapterOptions`](AdapterOptions.md)

## Extended by

- [`RestAdapterOptions`](RestAdapterOptions.md)

## Type Parameters

### T

`T` = `unknown` \| `any`

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [adapters/HttpAdapter.ts:179](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L179)

Base URL to prepend to all requests

***

### cacheOptions?

> `optional` **cacheOptions**: [`CacheOptions`](CacheOptions.md)

Defined in: [adapters/HttpAdapter.ts:191](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L191)

Cache configuration options

***

### errorInterceptor()?

> `optional` **errorInterceptor**: (`error`) => `void`

Defined in: [adapters/HttpAdapter.ts:187](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L187)

Handler for request errors

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### options?

> `optional` **options**: [`HttpRequestOptions`](HttpRequestOptions.md)

Defined in: [adapters/HttpAdapter.ts:181](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L181)

Default request options to apply to all requests

***

### requestHandler()?

> `optional` **requestHandler**: (`request`) => `Promise`\<[`HttpResponse`](../classes/HttpResponse.md)\<`any`\>\>

Defined in: [adapters/HttpAdapter.ts:189](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L189)

Custom request handler function

#### Parameters

##### request

[`HttpRequest`](../classes/HttpRequest.md)

#### Returns

`Promise`\<[`HttpResponse`](../classes/HttpResponse.md)\<`any`\>\>

***

### requestInterceptor()?

> `optional` **requestInterceptor**: (`request`) => [`HttpRequest`](../classes/HttpRequest.md)

Defined in: [adapters/HttpAdapter.ts:183](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L183)

Interceptor to modify requests before they are sent

#### Parameters

##### request

[`HttpRequest`](../classes/HttpRequest.md)

#### Returns

[`HttpRequest`](../classes/HttpRequest.md)

***

### responseInterceptor()?

> `optional` **responseInterceptor**: (`response`) => [`HttpResponse`](../classes/HttpResponse.md)\<`T`\>

Defined in: [adapters/HttpAdapter.ts:185](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L185)

Interceptor to modify responses after they are received

#### Parameters

##### response

[`HttpResponse`](../classes/HttpResponse.md)\<`T`\>

#### Returns

[`HttpResponse`](../classes/HttpResponse.md)\<`T`\>
