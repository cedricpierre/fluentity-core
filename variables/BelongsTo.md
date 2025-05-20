[**Fluentity Core Documentation**](../README.md)

***

[Fluentity Core Documentation](../globals.md) / BelongsTo

# Variable: BelongsTo()

> `const` **BelongsTo**: (`model`, `resource?`) => [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md) = `HasOne`

Defined in: [decorators.ts:113](https://github.com/cedricpierre/fluentity-core/blob/aeae44228536f4359f4af07d63f99633e9a3b24c/src/decorators.ts#L113)

Decorator for creating a has-one relationship between models.

## Parameters

### model

() => [`Constructor`](../type-aliases/Constructor.md)\<[`Model`](../classes/Model.md)\<`any`\>\>

Factory function that returns the related model constructor

### resource?

`string`

Optional custom resource name for the relation

## Returns

[`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md)

A property decorator function
