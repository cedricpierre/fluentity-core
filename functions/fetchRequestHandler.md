[**Fluentity Core Documentation**](../README.md)

***

[Fluentity Core Documentation](../globals.md) / fetchRequestHandler

# Function: fetchRequestHandler()

> **fetchRequestHandler**(`request`): `Promise`\<`any`\>

Defined in: [HttpClient.ts:143](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/HttpClient.ts#L143)

Default request handler that uses the Fetch API to make HTTP requests.

## Parameters

### request

[`HttpRequest`](../interfaces/HttpRequest.md)

The HTTP request configuration

## Returns

`Promise`\<`any`\>

A promise that resolves to the JSON response

## Throws

Error if the request fails
