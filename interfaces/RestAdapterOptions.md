[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / RestAdapterOptions

# Interface: RestAdapterOptions

Defined in: [adapters/RestAdapter.ts:114](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/RestAdapter.ts#L114)

Configuration options for the RestAdapter.
Extends HttpAdapterOptions with any additional REST-specific options.

## Extends

- `HttpAdapterOptions`

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [adapters/HttpAdapter.ts:145](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L145)

Base URL to prepend to all requests

#### Inherited from

`HttpAdapterOptions.baseUrl`

***

### cacheOptions?

> `optional` **cacheOptions**: `CacheOptions`

Defined in: [adapters/HttpAdapter.ts:157](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L157)

Cache configuration options

#### Inherited from

`HttpAdapterOptions.cacheOptions`

***

### errorInterceptor()?

> `optional` **errorInterceptor**: (`error`) => `void`

Defined in: [adapters/HttpAdapter.ts:153](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L153)

Handler for request errors

#### Parameters

##### error

`Error`

#### Returns

`void`

#### Inherited from

`HttpAdapterOptions.errorInterceptor`

***

### options?

> `optional` **options**: `HttpRequestOptions`

Defined in: [adapters/HttpAdapter.ts:147](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L147)

Default request options to apply to all requests

#### Inherited from

`HttpAdapterOptions.options`

***

### requestHandler()?

> `optional` **requestHandler**: (`request`) => `Promise`\<`HttpResponse`\<`any`\>\>

Defined in: [adapters/HttpAdapter.ts:155](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L155)

Custom request handler function

#### Parameters

##### request

`HttpRequest`

#### Returns

`Promise`\<`HttpResponse`\<`any`\>\>

#### Inherited from

`HttpAdapterOptions.requestHandler`

***

### requestInterceptor()?

> `optional` **requestInterceptor**: (`request`) => `HttpRequest`

Defined in: [adapters/HttpAdapter.ts:149](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L149)

Interceptor to modify requests before they are sent

#### Parameters

##### request

`HttpRequest`

#### Returns

`HttpRequest`

#### Inherited from

`HttpAdapterOptions.requestInterceptor`

***

### responseInterceptor()?

> `optional` **responseInterceptor**: (`response`) => `HttpResponse`\<`any`\>

Defined in: [adapters/HttpAdapter.ts:151](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/adapters/HttpAdapter.ts#L151)

Interceptor to modify responses after they are received

#### Parameters

##### response

`HttpResponse`\<`any`\>

#### Returns

`HttpResponse`\<`any`\>

#### Inherited from

`HttpAdapterOptions.responseInterceptor`
