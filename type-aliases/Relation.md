[**Fluentity Core Documentation**](../README.md)

***

[Fluentity Core Documentation](../globals.md) / Relation

# Type Alias: Relation\<T\>

> **Relation**\<`T`\> = `T` *extends* [`Model`](../classes/Model.md)\<`any`\> ? `HasOneRelationBuilder`\<`T`\> : `T` *extends* [`Model`](../classes/Model.md)\<`any`\>[] ? `HasManyRelationBuilder`\<`T`\[`number`\]\> : `never`

Defined in: [RelationBuilder.ts:11](https://github.com/cedricpierre/fluentity-core/blob/aeae44228536f4359f4af07d63f99633e9a3b24c/src/RelationBuilder.ts#L11)

Type that determines the appropriate relation builder based on the model type.

## Type Parameters

### T

`T`

The model type to determine the relation builder for
