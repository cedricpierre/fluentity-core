[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / AdapterOptions

# Interface: AdapterOptions

Defined in: [Fluentity.ts:65](https://github.com/cedricpierre/fluentity-core/blob/26f05b6b1157becd5e413d332a8cbeb24afb2c36/src/Fluentity.ts#L65)

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
