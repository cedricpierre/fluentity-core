[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / FluentityOptions

# Interface: FluentityOptions\<A\>

Defined in: [Fluentity.ts:104](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L104)

Configuration options for initializing Fluentity.

## Example

```typescript
const options: FluentityOptions<RestAdapter> = {
  adapter: new RestAdapter()
};
```

## Type Parameters

### A

`A` *extends* [`AdapterInterface`](AdapterInterface.md)

The type of adapter to use

## Properties

### adapter?

> `optional` **adapter**: `A`

Defined in: [Fluentity.ts:106](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L106)

The adapter instance to use for API communication
