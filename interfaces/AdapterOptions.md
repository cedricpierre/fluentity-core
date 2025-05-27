[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / AdapterOptions

# Interface: AdapterOptions

Defined in: [Fluentity.ts:65](https://github.com/cedricpierre/fluentity-core/blob/53497371d67800ca7958c21aa29051901836b6ff/src/Fluentity.ts#L65)

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
