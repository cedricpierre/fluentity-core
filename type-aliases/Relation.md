[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Relation

# Type Alias: Relation\<T\>

> **Relation**\<`T`\> = `T` *extends* [`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\> ? `HasOneRelationBuilder`\<`T`\> : `T` *extends* [`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\>[] ? `HasManyRelationBuilder`\<`T`\[`number`\]\> : `never`

Defined in: [RelationBuilder.ts:20](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/RelationBuilder.ts#L20)

Type that determines the appropriate relation builder based on the model type.
Maps model types to their corresponding relation builder types:
- Single model -> HasOneRelationBuilder
- Array of models -> HasManyRelationBuilder

## Type Parameters

### T

`T`

The model type to determine the relation builder for

## Example

```typescript
type UserRelation = Relation<User>; // HasOneRelationBuilder<User>
type UsersRelation = Relation<User[]>; // HasManyRelationBuilder<User>
```
