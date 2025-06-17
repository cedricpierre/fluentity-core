[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Fluentity

# Class: Fluentity\<A\>

Defined in: [Fluentity.ts:130](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L130)

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

Defined in: [Fluentity.ts:192](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L192)

Gets the adapter instance used for API communication.

##### Returns

`A`

The configured adapter instance

## Methods

### call()

> **call**(`queryBuilder`): `Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\<`any`\>\>

Defined in: [Fluentity.ts:272](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L272)

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

Defined in: [Fluentity.ts:177](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L177)

Configures the Fluentity instance with new options.
Updates the adapter and configuration settings.

#### Parameters

##### options?

[`FluentityOptions`](../interfaces/FluentityOptions.md)\<`A`\>

Optional configuration options to apply

#### Returns

`void`

#### Throws

If Fluentity has not been initialized

#### Example

```typescript
// Configure with new adapter
fluentity.configure({
  adapter: new CustomAdapter()
});
```

***

### call()

> `static` **call**(`queryBuilder`): `Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\<`any`\>\>

Defined in: [Fluentity.ts:293](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L293)

Calls the adapter with the given query builder using the singleton instance.
Static convenience method that delegates to the singleton instance.

#### Parameters

##### queryBuilder

[`QueryBuilder`](QueryBuilder.md)

The query builder to use

#### Returns

`Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\<`any`\>\>

The adapter response

#### Throws

If Fluentity has not been initialized

#### Example

```typescript
// Use static method
const response = await Fluentity.call(queryBuilder);

// Equivalent to
const fluentity = Fluentity.getInstance();
const response = await fluentity.call(queryBuilder);
```

***

### getInstance()

> `static` **getInstance**\<`A`\>(): `Fluentity`\<`A`\>

Defined in: [Fluentity.ts:259](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L259)

Gets the Fluentity singleton instance.

#### Type Parameters

##### A

`A` *extends* [`AdapterInterface`](../interfaces/AdapterInterface.md) = [`DefaultAdapter`](DefaultAdapter.md)

#### Returns

`Fluentity`\<`A`\>

The Fluentity instance

#### Throws

If Fluentity has not been initialized

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

Defined in: [Fluentity.ts:216](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L216)

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

Defined in: [Fluentity.ts:241](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L241)

Resets the Fluentity singleton instance.
Clears the current instance, allowing for re-initialization.
Useful for testing or when you need to change the adapter configuration.

#### Returns

`void`

#### Example

```typescript
// Reset for testing
Fluentity.reset();

// Re-initialize with different adapter
Fluentity.initialize({
  adapter: new CustomAdapter()
});
```
