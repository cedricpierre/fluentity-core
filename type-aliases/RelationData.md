[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / RelationData

# Type Alias: RelationData\<T, B\>

> **RelationData**\<`T`, `B`\> = `B` *extends* `HasOneRelationBuilder`\<`T`\> ? `T` : `T`[]

Defined in: [RelationBuilder.ts:56](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/RelationBuilder.ts#L56)

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
