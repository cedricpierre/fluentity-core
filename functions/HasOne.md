[**Fluentity Core Documentation**](../README.md)

***

[Fluentity Core Documentation](../globals.md) / HasOne

# Function: HasOne()

> **HasOne**(`model`, `resource?`): [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md)

Defined in: [decorators.ts:99](https://github.com/cedricpierre/fluentity-core/blob/aeae44228536f4359f4af07d63f99633e9a3b24c/src/decorators.ts#L99)

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
