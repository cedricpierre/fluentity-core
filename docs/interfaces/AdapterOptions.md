[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / AdapterOptions

# Interface: AdapterOptions

Defined in: [Fluentity.ts:65](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Fluentity.ts#L65)

Base interface for adapter request options.
Can be extended with additional properties by specific adapters.

## Example

```typescript
interface CustomAdapterOptions extends AdapterOptions {
  apiKey: string;
  retryCount: number;
}
```

## Extended by

- [`HttpAdapterOptions`](HttpAdapterOptions.md)
- [`HttpRequestOptions`](HttpRequestOptions.md)

## Indexable

\[`key`: `string`\]: `unknown`
