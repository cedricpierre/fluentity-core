[**FluORM Documentation**](../README.md)

***

[FluORM Documentation](../globals.md) / HttpClient

# Class: HttpClient

Defined in: HttpClient.ts:5

A static HTTP client class that provides methods for making HTTP requests with built-in caching,
interceptors, and request/response handling capabilities.

## Constructors

### Constructor

> **new HttpClient**(): `HttpClient`

#### Returns

`HttpClient`

## Properties

### options

> `static` **options**: `HttpClientOptions`

Defined in: HttpClient.ts:9

## Accessors

### cache

#### Get Signature

> **get** `static` **cache**(): `Map`\<`string`, `CacheData`\>

Defined in: HttpClient.ts:53

Gets the current cache map containing all cached responses.

##### Returns

`Map`\<`string`, `CacheData`\>

The cache map

***

### url

#### Get Signature

> **get** `static` **url**(): `string`

Defined in: HttpClient.ts:70

Gets the last URL that was called.

##### Returns

`string`

The last called URL

## Methods

### call()

> `static` **call**\<`T`\>(`url`, `options?`): `Promise`\<[`HttpResponse`](../type-aliases/HttpResponse.md)\<`T`\>\>

Defined in: HttpClient.ts:82

Makes an HTTP request to the specified URL with optional request options.
Handles caching, interceptors, and error handling.

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### url

`string`

The endpoint URL to call (will be appended to baseUrl)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

Optional request configuration

#### Returns

`Promise`\<[`HttpResponse`](../type-aliases/HttpResponse.md)\<`T`\>\>

A promise that resolves to the response data

#### Throws

Error if baseUrl is not configured or if the request fails

***

### clearCache()

> `static` **clearCache**(): `void`

Defined in: HttpClient.ts:45

Clears all cached responses.

#### Returns

`void`

***

### configure()

> `static` **configure**(`opts`): `void`

Defined in: HttpClient.ts:30

Configures the HTTP client with custom options.

#### Parameters

##### opts

`Partial`\<`HttpClientOptions`\>

Partial configuration options to merge with existing options

#### Returns

`void`

***

### deleteCache()

> `static` **deleteCache**(`url`): `void`

Defined in: HttpClient.ts:38

Removes a specific URL from the cache.

#### Parameters

##### url

`string`

The URL to remove from the cache

#### Returns

`void`

***

### getCache()

> `static` **getCache**\<`T`\>(`url`): `CacheData`

Defined in: HttpClient.ts:62

Retrieves cached data for a specific URL.

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### url

`string`

The URL to get cached data for

#### Returns

`CacheData`

The cached data if it exists
