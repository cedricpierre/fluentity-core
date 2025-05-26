[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / RelationBuilder

# Class: RelationBuilder\<T\>

Defined in: [RelationBuilder.ts:41](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/RelationBuilder.ts#L41)

Base class for building and managing relationships between models.
Provides methods for querying related models and building API requests.
This class is extended by HasOneRelationBuilder and HasManyRelationBuilder
to implement specific relationship behaviors.

## Example

```typescript
class UserPosts extends RelationBuilder<Post> {
  // Custom relationship logic
}
```

## Type Parameters

### T

`T` *extends* [`Model`](Model.md)\<[`Attributes`](../interfaces/Attributes.md)\>

The type of model this relation builder works with

## Indexable

\[`key`: `string`\]: `any`

Type definition for dynamic scope methods that can be added at runtime.
Allows for custom query scopes to be added to the builder.

## Constructors

### Constructor

> **new RelationBuilder**\<`T`\>(`model`, `queryBuilder`, `resource?`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:64](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/RelationBuilder.ts#L64)

Creates a new relation builder instance.
Sets up the query builder and configures the resource path.

#### Parameters

##### model

`T`

The model instance to build relations for

##### queryBuilder

[`QueryBuilder`](QueryBuilder.md)

Query builder instance for constructing API requests

##### resource?

`string`

Optional custom resource name for the relation

#### Returns

`RelationBuilder`\<`T`\>

#### Throws

If the model or query builder is invalid

## Properties

### queryBuilder

> **queryBuilder**: [`QueryBuilder`](QueryBuilder.md)

Defined in: [RelationBuilder.ts:46](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/RelationBuilder.ts#L46)

Query builder instance for constructing API URLs and managing query parameters.
Used internally to build the request URL and parameters.

## Methods

### filter()

> **filter**(`filters`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:168](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/RelationBuilder.ts#L168)

Adds filter conditions to the query.
Supports more complex filtering operations than where().

#### Parameters

##### filters

`Record`\<`string`, `any`\>

Object containing filter conditions

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for chaining

#### Example

```typescript
const posts = await user.posts.filter({
  created_at: { gt: '2023-01-01' },
  status: ['published', 'draft']
}).all();
```

***

### find()

> **find**(`id`): `Promise`\<`T`\>

Defined in: [RelationBuilder.ts:128](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/RelationBuilder.ts#L128)

Fetches a model instance by ID from the API.
Makes a GET request to retrieve the model data.

#### Parameters

##### id

The ID of the model to fetch

`string` | `number`

#### Returns

`Promise`\<`T`\>

A promise that resolves to the fetched model instance

#### Throws

If the model is not found

#### Example

```typescript
const post = await user.posts.find(123);
```

***

### id()

> **id**(`id`): `T`

Defined in: [RelationBuilder.ts:112](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/RelationBuilder.ts#L112)

Gets a model instance by ID without making an API request.
Creates a new model instance with the given ID for local operations.

#### Parameters

##### id

The ID of the model to get

`string` | `number`

#### Returns

`T`

A new model instance with the given ID

#### Example

```typescript
const post = user.posts.id(123);
```

***

### limit()

> **limit**(`n`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:202](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/RelationBuilder.ts#L202)

Limits the number of results returned.
Restricts the query to return at most n results.

#### Parameters

##### n

`number`

The maximum number of results to return

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for chaining

#### Example

```typescript
const posts = await user.posts.limit(10).all();
```

***

### offset()

> **offset**(`n`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:218](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/RelationBuilder.ts#L218)

Sets the offset for pagination in the query results.
Skips n records before starting to return results.

#### Parameters

##### n

`number`

The number of records to skip

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for chaining

#### Example

```typescript
const posts = await user.posts.offset(20).limit(10).all(); // Get posts 21-30
```

***

### orderBy()

> **orderBy**(`sort`, `direction`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:185](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/RelationBuilder.ts#L185)

Adds an order by clause to the query.
Sorts the results by the specified field and direction.

#### Parameters

##### sort

`string` = `'id'`

The field to order by (default: 'id')

##### direction

`string` = `'asc'`

The direction to order in ('asc' or 'desc', default: 'asc')

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for chaining

#### Example

```typescript
const posts = await user.posts.orderBy('created_at', 'desc').all();
```

***

### where()

> **where**(`where`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:149](https://github.com/cedricpierre/fluentity-core/blob/a7a49050b32c98a8003b6a47c54c291aedc4cf3f/src/RelationBuilder.ts#L149)

Adds a where clause to the query.
Filters results based on exact field-value matches.

#### Parameters

##### where

`Record`\<`string`, `any`\>

Object containing field-value pairs to filter by

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for chaining

#### Example

```typescript
const posts = await user.posts.where({ published: true }).all();
```
