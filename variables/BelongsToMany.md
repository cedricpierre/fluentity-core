[**Fluentity Core Documentation**](../README.md)

***

[Fluentity Core Documentation](../globals.md) / BelongsToMany

# Variable: BelongsToMany()

> `const` **BelongsToMany**: (`model`, `resource?`) => [`PropertyDecoratorType`](../type-aliases/PropertyDecoratorType.md) = `HasMany`

Defined in: [decorators.ts:114](https://github.com/cedricpierre/fluentity-core/blob/aeae44228536f4359f4af07d63f99633e9a3b24c/src/decorators.ts#L114)

Decorator for creating a has-many relationship between models.

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
