[**Fluentity Core Documentation**](../README.md)

***

[Fluentity Core Documentation](../globals.md) / BelongsTo

# Variable: BelongsTo()

> `const` **BelongsTo**: (`model`, `resource?`) => [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md) = `HasOne`

Defined in: [decorators.ts:113](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/decorators.ts#L113)

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
