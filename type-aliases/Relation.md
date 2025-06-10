[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Relation

# Type Alias: Relation\<T\>

> **Relation**\<`T`\> = `T` *extends* [`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\>[] ? `HasManyRelationBuilder`\<`T`\[`number`\]\> : `HasOneRelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:35](https://github.com/cedricpierre/fluentity-core/blob/a11029d5e0c9be6995be4b907c0a3cdf4a79c12b/src/RelationBuilder.ts#L35)

Type that determines the appropriate relation builder or model instance based on the model type.
Maps model types to their corresponding relation builder types or model instances:
- Single model -> HasOneRelationBuilder<T> | T
- Array of models -> HasManyRelationBuilder<T[number]> | T[]

This type is used internally to ensure type safety when working with relationships.

## Type Parameters

### T

`T` *extends* [`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\>

The model type to determine the relation type for

## Example

```typescript
// Has-one relationship
type UserProfile = Relation<Profile>; // HasOneRelationBuilder<Profile> | Profile

// Has-many relationship
type UserPosts = Relation<Post[]>; // HasManyRelationBuilder<Post> | Post[]

// Usage in model definitions
class User extends Model {
  @HasOne(() => Profile)
  profile: Relation<Profile>;

  @HasMany(() => Post)
  posts: Relation<Post[]>;
}
```
