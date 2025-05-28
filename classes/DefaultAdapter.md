[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / DefaultAdapter

# Class: DefaultAdapter

Defined in: [adapters/DefaultAdapter.ts:3](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/adapters/DefaultAdapter.ts#L3)

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

## Implements

- [`AdapterInterface`](../interfaces/AdapterInterface.md)

## Constructors

### Constructor

> **new DefaultAdapter**(): `DefaultAdapter`

#### Returns

`DefaultAdapter`

## Properties

### options

> **options**: [`AdapterOptions`](../interfaces/AdapterOptions.md) = `{}`

Defined in: [adapters/DefaultAdapter.ts:4](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/adapters/DefaultAdapter.ts#L4)

The options for the adapter.
Contains configuration settings specific to the adapter implementation.

#### Implementation of

[`AdapterInterface`](../interfaces/AdapterInterface.md).[`options`](../interfaces/AdapterInterface.md#options)

## Methods

### call()

> **call**(`_queryBuilder`): `Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\>

Defined in: [adapters/DefaultAdapter.ts:5](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/adapters/DefaultAdapter.ts#L5)

Makes an API request using the adapter's implementation.

#### Parameters

##### \_queryBuilder

[`QueryBuilder`](QueryBuilder.md)

#### Returns

`Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\>

Promise resolving to the API response

#### Throws

If the request fails

#### Implementation of

[`AdapterInterface`](../interfaces/AdapterInterface.md).[`call`](../interfaces/AdapterInterface.md#call)

***

### configure()

> **configure**(`_options`): `void`

Defined in: [adapters/DefaultAdapter.ts:9](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/adapters/DefaultAdapter.ts#L9)

Configures the adapter with additional options.

#### Parameters

##### \_options

`Partial`\<[`AdapterOptions`](../interfaces/AdapterOptions.md)\>

#### Returns

`void`

#### Example

```typescript
adapter.configure({
  baseURL: 'https://api.example.com',
  timeout: 5000
});
```

#### Implementation of

[`AdapterInterface`](../interfaces/AdapterInterface.md).[`configure`](../interfaces/AdapterInterface.md#configure)
