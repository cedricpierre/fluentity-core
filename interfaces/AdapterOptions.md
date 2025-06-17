[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / AdapterOptions

# Interface: AdapterOptions

Defined in: [Fluentity.ts:65](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/Fluentity.ts#L65)

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
