[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / FluentityOptions

# Interface: FluentityOptions\<A\>

Defined in: [Fluentity.ts:104](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/Fluentity.ts#L104)

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

Defined in: [Fluentity.ts:106](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/Fluentity.ts#L106)

The adapter instance to use for API communication
