[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / DefaultAdapter

# Class: DefaultAdapter

Defined in: [adapters/DefaultAdapter.ts:19](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/adapters/DefaultAdapter.ts#L19)

Default adapter implementation that provides no-op behavior.
Used as a fallback when no specific adapter is configured.
Returns undefined data for all requests.

## Example

```typescript
// Used automatically when no adapter is specified
Fluentity.initialize();

// Or explicitly
Fluentity.initialize({
  adapter: new DefaultAdapter()
});
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

Defined in: [adapters/DefaultAdapter.ts:20](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/adapters/DefaultAdapter.ts#L20)

The options for the adapter.
Contains configuration settings specific to the adapter implementation.

#### Implementation of

[`AdapterInterface`](../interfaces/AdapterInterface.md).[`options`](../interfaces/AdapterInterface.md#options)

## Methods

### call()

> **call**(`_queryBuilder`): `Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\>

Defined in: [adapters/DefaultAdapter.ts:35](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/adapters/DefaultAdapter.ts#L35)

Makes a mock API request that always returns undefined data.
This is a no-op implementation for testing or when no real API is available.

#### Parameters

##### \_queryBuilder

[`QueryBuilder`](QueryBuilder.md)

The query builder (unused in this implementation)

#### Returns

`Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\>

Promise resolving to an empty response

#### Example

```typescript
const adapter = new DefaultAdapter();
const response = await adapter.call(new QueryBuilder());
// response.data is undefined
```

#### Implementation of

[`AdapterInterface`](../interfaces/AdapterInterface.md).[`call`](../interfaces/AdapterInterface.md#call)

***

### configure()

> **configure**(`_options`): `void`

Defined in: [adapters/DefaultAdapter.ts:50](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/adapters/DefaultAdapter.ts#L50)

Configures the adapter with options (no-op in this implementation).
This method exists to satisfy the AdapterInterface contract.

#### Parameters

##### \_options

`Partial`\<[`AdapterOptions`](../interfaces/AdapterOptions.md)\>

Configuration options (unused in this implementation)

#### Returns

`void`

#### Example

```typescript
const adapter = new DefaultAdapter();
adapter.configure({ baseURL: 'https://example.com' }); // No effect
```

#### Implementation of

[`AdapterInterface`](../interfaces/AdapterInterface.md).[`configure`](../interfaces/AdapterInterface.md#configure)
