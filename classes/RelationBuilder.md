[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / RelationBuilder

# Class: RelationBuilder\<T\>

Defined in: [RelationBuilder.ts:69](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/RelationBuilder.ts#L69)

Base class for building and managing relationships between models.
Provides methods for querying related models and building API requests.
This class is extended by HasOneRelationBuilder and HasManyRelationBuilder
to implement specific relationship behaviors.

Features:
- Query building and filtering
- Sorting and pagination
- Relationship traversal
- Custom query scopes

## Example

```typescript
// Basic usage with a has-one relationship
class UserProfile extends RelationBuilder<Profile> {
  // Custom relationship logic
}

// Usage with query building
const posts = await user.posts
  .where({ status: 'published' })
  .orderBy('created_at', 'desc')
  .limit(10)
  .all();
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

Defined in: [RelationBuilder.ts:105](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/RelationBuilder.ts#L105)

Creates a new relation builder instance.
Sets up the query builder and configures the resource path.
Handles inheritance of parent query parameters and custom scopes.

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

#### Example

```typescript
// Create a basic relation builder
const builder = new RelationBuilder(User, new QueryBuilder());

// Create with custom resource
const builder = new RelationBuilder(User, new QueryBuilder(), 'custom-users');

// Create with parent query
const parentQuery = new QueryBuilder().where({ active: true });
const builder = new RelationBuilder(User, parentQuery);
```

## Properties

### queryBuilder

> **queryBuilder**: [`QueryBuilder`](QueryBuilder.md)

Defined in: [RelationBuilder.ts:74](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/RelationBuilder.ts#L74)

Query builder instance for constructing API URLs and managing query parameters.
Used internally to build the request URL and parameters.

## Methods

### filter()

> **filter**(`filters`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:272](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/RelationBuilder.ts#L272)

Adds filter conditions to the query.
Supports more complex filtering operations than where().
Can handle comparison operators, arrays, and nested conditions.

#### Parameters

##### filters

`Record`\<`string`, `any`\>

Object containing filter conditions

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for method chaining

#### Example

```typescript
// Comparison operators
const posts = await user.posts
  .filter({
    views: { gt: 1000 },
    rating: { gte: 4.5 }
  })
  .all();

// Array conditions
const posts = await user.posts
  .filter({
    tags: { in: ['featured', 'popular'] },
    status: ['published', 'draft']
  })
  .all();

// Nested conditions
const posts = await user.posts
  .filter({
    author: {
      role: 'admin',
      status: 'active'
    }
  })
  .all();
```

***

### find()

> **find**(`id`): `Promise`\<`T`\>

Defined in: [RelationBuilder.ts:191](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/RelationBuilder.ts#L191)

Fetches a model instance by ID from the API.
Makes a GET request to retrieve the model data.
Throws an error if the model is not found.

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
// Fetch a post by ID
const post = await user.posts.find(123);

// Fetch with error handling
try {
  const post = await user.posts.find(123);
  console.log(`Found post: ${post.title}`);
} catch (error) {
  if (error.status === 404) {
    console.log('Post not found');
  } else {
    console.error('Error fetching post:', error);
  }
}
```

***

### id()

> **id**(`id`): `T`

Defined in: [RelationBuilder.ts:161](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/RelationBuilder.ts#L161)

Gets a model instance by ID without making an API request.
Creates a new model instance with the given ID for local operations.
Useful for setting up relationships or references.

#### Parameters

##### id

The ID of the model to get

`string` | `number`

#### Returns

`T`

A new model instance with the given ID

#### Example

```typescript
// Get a reference to a post
const post = user.posts.id(123);

// Use in relationship setup
const comment = await Comment.create({
  content: 'Great post!',
  post: user.posts.id(123)
});
```

***

### limit()

> **limit**(`n`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:331](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/RelationBuilder.ts#L331)

Limits the number of results returned.
Restricts the query to return at most n results.
Useful for pagination or limiting large result sets.

#### Parameters

##### n

`number`

The maximum number of results to return

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for method chaining

#### Example

```typescript
// Get only 10 posts
const posts = await user.posts
  .limit(10)
  .all();

// Use with pagination
const posts = await user.posts
  .limit(20)
  .offset(40) // Get posts 41-60
  .all();
```

***

### offset()

> **offset**(`n`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:357](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/RelationBuilder.ts#L357)

Sets the offset for pagination in the query results.
Skips n records before starting to return results.
Often used with limit() for pagination.

#### Parameters

##### n

`number`

The number of records to skip

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for method chaining

#### Example

```typescript
// Skip first 20 posts
const posts = await user.posts
  .offset(20)
  .all();

// Use with limit for pagination
const posts = await user.posts
  .limit(10)
  .offset(30) // Get posts 31-40
  .all();
```

***

### orderBy()

> **orderBy**(`sort`, `direction`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:304](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/RelationBuilder.ts#L304)

Adds an order by clause to the query.
Sorts the results by the specified field and direction.
Multiple calls to orderBy() will use the last one.

#### Parameters

##### sort

`string` = `'id'`

The field to order by (default: 'id')

##### direction

`string` = `'asc'`

The direction to order in ('asc' or 'desc', default: 'asc')

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for method chaining

#### Example

```typescript
// Sort by single field
const posts = await user.posts
  .orderBy('created_at', 'desc')
  .all();

// Sort by multiple fields
const posts = await user.posts
  .orderBy('status', 'asc')
  .orderBy('created_at', 'desc')
  .all();

// Default sorting
const posts = await user.posts
  .orderBy() // Sorts by 'id' in ascending order
  .all();
```

***

### where()

> **where**(`where`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:231](https://github.com/cedricpierre/fluentity-core/blob/e69b5ec0e02f4965a6853e60ab7e5019d15e99ca/src/RelationBuilder.ts#L231)

Adds a where clause to the query.
Filters results based on exact field-value matches.
Multiple calls to where() will merge the conditions.

#### Parameters

##### where

`Record`\<`string`, `any`\>

Object containing field-value pairs to filter by

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for method chaining

#### Example

```typescript
// Simple equality conditions
const posts = await user.posts
  .where({ status: 'published' })
  .all();

// Multiple conditions
const posts = await user.posts
  .where({
    status: 'published',
    type: 'article',
    featured: true
  })
  .all();

// Multiple where calls
const posts = await user.posts
  .where({ status: 'published' })
  .where({ type: 'article' })
  .all();
```
