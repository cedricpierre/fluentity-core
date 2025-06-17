[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / RestAdapterOptions

# Interface: RestAdapterOptions

Defined in: [adapters/RestAdapter.ts:115](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/RestAdapter.ts#L115)

Configuration options for the RestAdapter.
Extends HttpAdapterOptions with any additional REST-specific options.

## Extends

- [`HttpAdapterOptions`](HttpAdapterOptions.md)

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [adapters/HttpAdapter.ts:179](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L179)

Base URL to prepend to all requests

#### Inherited from

[`HttpAdapterOptions`](HttpAdapterOptions.md).[`baseUrl`](HttpAdapterOptions.md#baseurl)

***

### cacheOptions?

> `optional` **cacheOptions**: [`CacheOptions`](CacheOptions.md)

Defined in: [adapters/HttpAdapter.ts:191](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L191)

Cache configuration options

#### Inherited from

[`HttpAdapterOptions`](HttpAdapterOptions.md).[`cacheOptions`](HttpAdapterOptions.md#cacheoptions)

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

#### Inherited from

[`HttpAdapterOptions`](HttpAdapterOptions.md).[`errorInterceptor`](HttpAdapterOptions.md#errorinterceptor)

***

### options?

> `optional` **options**: [`HttpRequestOptions`](HttpRequestOptions.md)

Defined in: [adapters/HttpAdapter.ts:181](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L181)

Default request options to apply to all requests

#### Inherited from

[`HttpAdapterOptions`](HttpAdapterOptions.md).[`options`](HttpAdapterOptions.md#options)

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

#### Inherited from

[`HttpAdapterOptions`](HttpAdapterOptions.md).[`requestHandler`](HttpAdapterOptions.md#requesthandler)

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

#### Inherited from

[`HttpAdapterOptions`](HttpAdapterOptions.md).[`requestInterceptor`](HttpAdapterOptions.md#requestinterceptor)

***

### responseInterceptor()?

> `optional` **responseInterceptor**: (`response`) => [`HttpResponse`](../classes/HttpResponse.md)\<`any`\>

Defined in: [adapters/HttpAdapter.ts:185](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/adapters/HttpAdapter.ts#L185)

Interceptor to modify responses after they are received

#### Parameters

##### response

[`HttpResponse`](../classes/HttpResponse.md)\<`any`\>

#### Returns

[`HttpResponse`](../classes/HttpResponse.md)\<`any`\>

#### Inherited from

[`HttpAdapterOptions`](HttpAdapterOptions.md).[`responseInterceptor`](HttpAdapterOptions.md#responseinterceptor)
