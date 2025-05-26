[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / AdapterOptions

# Interface: AdapterOptions

Defined in: [Fluentity.ts:65](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/Fluentity.ts#L65)

Base interface for adapter request options.
Can be extended with additional properties by specific adapters.

## Example

```typescript
interface CustomAdapterOptions extends AdapterOptions {
  apiKey: string;
  retryCount: number;
}
```

## Indexable

\[`key`: `string`\]: `unknown`
