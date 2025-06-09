[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Relation

# Type Alias: Relation\<T\>

> **Relation**\<`T`\> = `T` *extends* [`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\> ? `HasOneRelationBuilder`\<`T`\> : `T` *extends* [`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\>[] ? `HasManyRelationBuilder`\<`T`\[`number`\]\> : `never`

Defined in: [RelationBuilder.ts:35](https://github.com/cedricpierre/fluentity-core/blob/3fe6c86a18154ac4efbce09906962ec5c54c4879/src/RelationBuilder.ts#L35)

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
