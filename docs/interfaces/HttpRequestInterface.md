[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / HttpRequestInterface

# Interface: HttpRequestInterface

Defined in: [adapters/HttpAdapter.ts:204](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L204)

## Properties

### body?

> `optional` **body**: `string` \| `object` \| `object`[]

Defined in: [adapters/HttpAdapter.ts:212](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L212)

Request body data

***

### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"` \| `"HEAD"` \| `"OPTIONS"`

Defined in: [adapters/HttpAdapter.ts:210](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L210)

HTTP method to use

***

### options?

> `optional` **options**: [`HttpRequestOptions`](HttpRequestOptions.md)

Defined in: [adapters/HttpAdapter.ts:208](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L208)

Request options including method, headers, body, etc.

***

### url

> **url**: `string`

Defined in: [adapters/HttpAdapter.ts:206](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L206)

The full URL to send the request to
