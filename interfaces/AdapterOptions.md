[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / AdapterOptions

# Interface: AdapterOptions

Defined in: [Fluentity.ts:65](https://github.com/cedricpierre/fluentity-core/blob/3d631f9d75799f08579e51e69ea25c119384e045/src/Fluentity.ts#L65)

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
