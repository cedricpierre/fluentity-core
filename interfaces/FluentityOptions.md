[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / FluentityOptions

# Interface: FluentityOptions\<A\>

Defined in: [Fluentity.ts:136](https://github.com/cedricpierre/fluentity-core/blob/dd8a9677399483c7f219407b62f6d0050aff02e4/src/Fluentity.ts#L136)

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

Defined in: [Fluentity.ts:138](https://github.com/cedricpierre/fluentity-core/blob/dd8a9677399483c7f219407b62f6d0050aff02e4/src/Fluentity.ts#L138)

The adapter instance to use for API communication
