[**FluORM Documentation**](../README.md)

***

[FluORM Documentation](../globals.md) / Relation

# Type Alias: Relation\<T\>

> **Relation**\<`T`\> = `T` *extends* [`Model`](../classes/Model.md)\<`any`\> ? `HasOneRelationBuilder`\<`T`\> : `T` *extends* [`Model`](../classes/Model.md)\<`any`\>[] ? `HasManyRelationBuilder`\<`T`\[`number`\]\> : `never`

Defined in: RelationBuilder.ts:11

Type that determines the appropriate relation builder based on the model type.

## Type Parameters

### T

`T`

The model type to determine the relation builder for
