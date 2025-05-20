[**Fluentity Core Documentation**](../README.md)

***

[Fluentity Core Documentation](../globals.md) / RequestOptions

# Interface: RequestOptions

Defined in: [HttpClient.ts:223](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L223)

Configuration options for HTTP requests.
Extends the standard Fetch API RequestInit interface with additional options.

## Properties

### body?

> `optional` **body**: `any`

Defined in: [HttpClient.ts:225](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L225)

Request body data

***

### cache?

> `optional` **cache**: `RequestCache`

Defined in: [HttpClient.ts:243](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L243)

Cache mode

***

### credentials?

> `optional` **credentials**: `RequestCredentials`

Defined in: [HttpClient.ts:231](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L231)

Request credentials mode

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [HttpClient.ts:229](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L229)

Request headers

***

### integrity?

> `optional` **integrity**: `string`

Defined in: [HttpClient.ts:241](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L241)

Subresource integrity value

***

### keepalive?

> `optional` **keepalive**: `boolean`

Defined in: [HttpClient.ts:245](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L245)

Whether to keep the connection alive

***

### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"` \| `"HEAD"` \| `"OPTIONS"`

Defined in: [HttpClient.ts:227](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L227)

HTTP method to use

***

### mode?

> `optional` **mode**: `RequestMode`

Defined in: [HttpClient.ts:233](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L233)

Request mode

***

### redirect?

> `optional` **redirect**: `RequestRedirect`

Defined in: [HttpClient.ts:235](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L235)

How to handle redirects

***

### referrer?

> `optional` **referrer**: `string`

Defined in: [HttpClient.ts:237](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L237)

Referrer URL

***

### referrerPolicy?

> `optional` **referrerPolicy**: `ReferrerPolicy`

Defined in: [HttpClient.ts:239](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L239)

Referrer policy

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [HttpClient.ts:247](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L247)

Abort signal for cancelling the request
