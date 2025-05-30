[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Relation

# Type Alias: Relation\<T\>

> **Relation**\<`T`\> = `T` *extends* [`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\> ? `HasOneRelationBuilder`\<`T`\> : `T` *extends* [`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\>[] ? `HasManyRelationBuilder`\<`T`\[`number`\]\> : `never`

Defined in: [RelationBuilder.ts:35](https://github.com/cedricpierre/fluentity-core/blob/1e69a8de935352455e2e344f5f8b480e30c89eda/src/RelationBuilder.ts#L35)

Type that determines the appropriate relation builder based on the model type.
Maps model types to their corresponding relation builder types:
- Single model -> HasOneRelationBuilder
- Array of models -> HasManyRelationBuilder

This type is used internally to ensure type safety when working with relationships.

## Type Parameters

### T

`T`

The model type to determine the relation builder for

## Example

```typescript
// Has-one relationship
type UserProfile = Relation<Profile>; // HasOneRelationBuilder<Profile>

// Has-many relationship
type UserPosts = Relation<Post[]>; // HasManyRelationBuilder<Post>

// Usage in model definitions
class User extends Model {
  @HasOne(() => Profile)
  profile: Relation<Profile>;

  @HasMany(() => Post)
  posts: Relation<Post[]>;
}
```
