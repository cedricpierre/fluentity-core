[**Fluentity Core Documentation**](../README.md)

***

[Fluentity Core Documentation](../globals.md) / HasOne

# Function: HasOne()

> **HasOne**(`model`, `resource?`): [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md)

Defined in: [decorators.ts:99](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/decorators.ts#L99)

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
