[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Fluentity

# Class: Fluentity\<A\>

Defined in: [Fluentity.ts:162](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/Fluentity.ts#L162)

Main Fluentity class that manages API communication.
Implements the singleton pattern to ensure a single instance is used throughout the application.
Handles adapter management and provides a central point for API communication.

## Example

```typescript
// Initialize with custom adapter
Fluentity.initialize({
  adapter: new RestAdapter()
});

// Get instance
const fluentity = Fluentity.getInstance();

// Use the adapter
const response = await fluentity.adapter.call(queryBuilder);
```

## Type Parameters

### A

`A` *extends* [`AdapterInterface`](../interfaces/AdapterInterface.md) = [`DefaultAdapter`](DefaultAdapter.md)

The type of adapter being used

## Accessors

### adapter

#### Get Signature

> **get** **adapter**(): `A`

Defined in: [Fluentity.ts:211](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/Fluentity.ts#L211)

Gets the adapter instance used for API communication.

##### Returns

`A`

The configured adapter instance

## Methods

### call()

> **call**(`queryBuilder`): `Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\<`any`\>\>

Defined in: [Fluentity.ts:277](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/Fluentity.ts#L277)

Calls the adapter with the given query builder.

#### Parameters

##### queryBuilder

[`QueryBuilder`](QueryBuilder.md)

The query builder to use

#### Returns

`Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\<`any`\>\>

The adapter response

***

### configure()

> **configure**(`options?`): `void`

Defined in: [Fluentity.ts:196](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/Fluentity.ts#L196)

#### Parameters

##### options?

[`FluentityOptions`](../interfaces/FluentityOptions.md)\<`A`\>

#### Returns

`void`

***

### call()

> `static` **call**(`queryBuilder`): `Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\<`any`\>\>

Defined in: [Fluentity.ts:287](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/Fluentity.ts#L287)

Calls the adapter with the given query builder.

#### Parameters

##### queryBuilder

[`QueryBuilder`](QueryBuilder.md)

The query builder to use

#### Returns

`Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\<`any`\>\>

The adapter response

#### Static

***

### getInstance()

> `static` **getInstance**\<`A`\>(): `Fluentity`\<`A`\>

Defined in: [Fluentity.ts:264](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/Fluentity.ts#L264)

Gets the Fluentity singleton instance.

#### Type Parameters

##### A

`A` *extends* [`AdapterInterface`](../interfaces/AdapterInterface.md) = [`DefaultAdapter`](DefaultAdapter.md)

#### Returns

`Fluentity`\<`A`\>

The Fluentity instance

#### Throws

If Fluentity has not been initialized

#### Static

#### Example

```typescript
// Get the instance after initialization
const fluentity = Fluentity.getInstance<CustomAdapter>();

// The adapter type is automatically inferred
const adapter = fluentity.adapter;
```

***

### initialize()

> `static` **initialize**\<`A`\>(`options?`): `Fluentity`\<`A`\>

Defined in: [Fluentity.ts:236](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/Fluentity.ts#L236)

Initializes the Fluentity singleton instance.
Must be called before using any other Fluentity functionality.

#### Type Parameters

##### A

`A` *extends* [`AdapterInterface`](../interfaces/AdapterInterface.md) = [`DefaultAdapter`](DefaultAdapter.md)

#### Parameters

##### options?

[`FluentityOptions`](../interfaces/FluentityOptions.md)\<`A`\>

Configuration options for Fluentity

#### Returns

`Fluentity`\<`A`\>

The initialized Fluentity instance

#### Throws

If Fluentity has already been initialized

#### Static

#### Example

```typescript
// Initialize with default adapter
Fluentity.initialize();

// Initialize with custom adapter
Fluentity.initialize({
  adapter: new RestAdapter({
    baseURL: 'https://api.example.com'
  })
});
```

***

### reset()

> `static` **reset**(): `void`

Defined in: [Fluentity.ts:245](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/Fluentity.ts#L245)

#### Returns

`void`
