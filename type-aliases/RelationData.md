[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / RelationData

# Type Alias: RelationData\<T, B\>

> **RelationData**\<`T`, `B`\> = `B` *extends* `HasOneRelationBuilder`\<`T`\> ? `T` : `T`[]

Defined in: [RelationBuilder.ts:54](https://github.com/cedricpierre/fluentity-core/blob/a11029d5e0c9be6995be4b907c0a3cdf4a79c12b/src/RelationBuilder.ts#L54)

Type that determines the appropriate data type based on the relation builder type.
Returns T if the builder is a HasOneRelationBuilder, otherwise returns T[].

## Type Parameters

### T

`T` *extends* [`Model`](../classes/Model.md)\<[`Attributes`](../interfaces/Attributes.md)\>

The model type

### B

`B` *extends* [`RelationBuilder`](../classes/RelationBuilder.md)\<`T`\> = [`RelationBuilder`](../classes/RelationBuilder.md)\<`T`\>

The relation builder type (defaults to RelationBuilder<T>)

## Example

```typescript
// For has-one relationships
type ProfileData = RelationData<Profile>; // Profile

// For has-many relationships
type PostsData = RelationData<Post>; // Post[]
```
