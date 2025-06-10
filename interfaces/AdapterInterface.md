[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / AdapterInterface

# Interface: AdapterInterface

Defined in: [Fluentity.ts:21](https://github.com/cedricpierre/fluentity-core/blob/34a9bb28becd0618e108897eaa31bb1d138fb663/src/Fluentity.ts#L21)

Interface for adapters that handle API communication.
Adapters must implement methods for making HTTP requests and configuration.

## Example

```typescript
class CustomAdapter implements AdapterInterface {
  async call(queryBuilder: QueryBuilder): Promise<AdapterResponse> {
    // Make HTTP request
  }
  configure(options: Partial<AdapterOptions>): void {
    // Configure adapter
  }
}
```

## Properties

### options

> **options**: [`AdapterOptions`](AdapterOptions.md)

Defined in: [Fluentity.ts:26](https://github.com/cedricpierre/fluentity-core/blob/34a9bb28becd0618e108897eaa31bb1d138fb663/src/Fluentity.ts#L26)

The options for the adapter.
Contains configuration settings specific to the adapter implementation.

## Methods

### call()

> **call**(`queryBuilder`): `Promise`\<[`AdapterResponse`](AdapterResponse.md)\<`any`\>\>

Defined in: [Fluentity.ts:35](https://github.com/cedricpierre/fluentity-core/blob/34a9bb28becd0618e108897eaa31bb1d138fb663/src/Fluentity.ts#L35)

Makes an API request using the adapter's implementation.

#### Parameters

##### queryBuilder

[`QueryBuilder`](../classes/QueryBuilder.md)

The query builder containing request details

#### Returns

`Promise`\<[`AdapterResponse`](AdapterResponse.md)\<`any`\>\>

Promise resolving to the API response

#### Throws

If the request fails

***

### configure()

> **configure**(`options`): `void`

Defined in: [Fluentity.ts:49](https://github.com/cedricpierre/fluentity-core/blob/34a9bb28becd0618e108897eaa31bb1d138fb663/src/Fluentity.ts#L49)

Configures the adapter with additional options.

#### Parameters

##### options

`Partial`\<[`AdapterOptions`](AdapterOptions.md)\>

The configuration options to apply

#### Returns

`void`

#### Example

```typescript
adapter.configure({
  baseURL: 'https://api.example.com',
  timeout: 5000
});
```
