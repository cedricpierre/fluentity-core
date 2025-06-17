[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / HasManyRelationBuilder

# Class: HasManyRelationBuilder\<T\>

Defined in: [HasManyRelationBuilder.ts:34](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/HasManyRelationBuilder.ts#L34)

Builder class for has-many relationships between models.
Provides methods for managing a one-to-many relationship with another model.
Used when a model has multiple related model instances.

Features:
- Collection retrieval and filtering
- Model creation
- Model updates
- Model deletion
- Pagination support
- Relationship traversal

## Example

```typescript
// Basic usage in a model
class User extends Model {
  @HasMany(() => Post)
  posts: Post[];
}

// Usage in queries
const posts = await user.posts.all();
const post = await user.posts.create({ title: 'New Post' });
await user.posts.update(123, { title: 'Updated Post' });
await user.posts.delete(123);
```

## Extends

- [`RelationBuilder`](RelationBuilder.md)\<`T`\>

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

> **new HasManyRelationBuilder**\<`T`\>(`model`, `parentQuery?`): `HasManyRelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:131](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/RelationBuilder.ts#L131)

Creates a new relation builder instance.
Sets up the query builder and configures the resource path.
Handles inheritance of parent query parameters and custom scopes.

#### Parameters

##### model

`T`

The model instance to build relations for

##### parentQuery?

[`QueryBuilder`](QueryBuilder.md)

Query builder instance for constructing API requests

#### Returns

`HasManyRelationBuilder`\<`T`\>

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

#### Inherited from

[`RelationBuilder`](RelationBuilder.md).[`constructor`](RelationBuilder.md#constructor)

## Accessors

### data

#### Get Signature

> **get** **data**(): [`RelationData`](../type-aliases/RelationData.md)\<`T`, `this`\>

Defined in: [RelationBuilder.ts:161](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/RelationBuilder.ts#L161)

Gets the data associated with this relation builder.
Returns T[] if T is an array type, otherwise returns T.

##### Returns

[`RelationData`](../type-aliases/RelationData.md)\<`T`, `this`\>

#### Set Signature

> **set** **data**(`value`): `void`

Defined in: [RelationBuilder.ts:169](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/RelationBuilder.ts#L169)

Sets the data associated with this relation builder.

##### Parameters

###### value

[`RelationData`](../type-aliases/RelationData.md)\<`T`, `this`\>

The data to set

##### Returns

`void`

#### Inherited from

[`RelationBuilder`](RelationBuilder.md).[`data`](RelationBuilder.md#data)

## Methods

### all()

> **all**(): `Promise`\<`T`[]\>

Defined in: [HasManyRelationBuilder.ts:70](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/HasManyRelationBuilder.ts#L70)

Fetches all related model instances.
Makes a GET request to retrieve all related models.
Use with caution for large collections - consider using pagination.

#### Returns

`Promise`\<`T`[]\>

A promise that resolves to an array of related model instances

#### Throws

If the request fails

#### Example

```typescript
// Get all posts
const posts = await user.posts.all();
console.log(`Found ${posts.length} posts`);

// Get with filtering
const posts = await user.posts
  .where({ status: 'published' })
  .orderBy('created_at', 'desc')
  .all();

// Get with error handling
try {
  const posts = await user.posts.all();
  console.log('Posts loaded successfully');
} catch (error) {
  console.error('Error loading posts:', error);
}

// Use in relationship chain
const user = await User.find(123);
const comments = await user.posts
  .find(456)
  .comments
  .all();
```

***

### create()

> **create**\<`A`\>(`data`): `Promise`\<`T`\>

Defined in: [HasManyRelationBuilder.ts:117](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/HasManyRelationBuilder.ts#L117)

Creates a new related model instance.
Makes a POST request to create a new related model.
The new model is automatically associated with the parent model.

#### Type Parameters

##### A

`A` *extends* `Partial`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### data

`A`

The data to create the new model with

#### Returns

`Promise`\<`T`\>

A promise that resolves to the created model instance

#### Throws

If the creation fails

#### Example

```typescript
// Create a new post
const post = await user.posts.create({
  title: 'New Post',
  content: 'Post content',
  status: 'draft'
});

// Create with error handling
try {
  const post = await user.posts.create({
    title: 'New Post',
    content: 'Post content'
  });
  console.log(`Created post with ID: ${post.id}`);
} catch (error) {
  if (error.status === 422) {
    console.log('Validation failed:', error.errors);
  } else {
    console.error('Error creating post:', error);
  }
}

// Create in relationship chain
const user = await User.find(123);
const comment = await user.posts
  .find(456)
  .comments
  .create({ content: 'Great post!' });
```

***

### delete()

> **delete**(`id`): `Promise`\<`void`\>

Defined in: [HasManyRelationBuilder.ts:158](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/HasManyRelationBuilder.ts#L158)

Deletes a related model instance by ID.
Makes a DELETE request to remove a specific related model.
The local instance remains but becomes detached from the server.

#### Parameters

##### id

The ID of the model to delete

`string` | `number`

#### Returns

`Promise`\<`void`\>

A promise that resolves when the deletion is complete

#### Throws

If the deletion fails

#### Example

```typescript
// Delete a post
await user.posts.delete(123);

// Delete with error handling
try {
  await user.posts.delete(123);
  console.log('Post deleted successfully');
} catch (error) {
  if (error.status === 404) {
    console.log('Post not found');
  } else {
    console.error('Error deleting post:', error);
  }
}

// Delete in relationship chain
const user = await User.find(123);
await user.posts
  .find(456)
  .comments
  .delete(789);
```

***

### filter()

> **filter**(`filters`): [`RelationBuilder`](RelationBuilder.md)\<`T`\>

Defined in: [RelationBuilder.ts:334](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/RelationBuilder.ts#L334)

Adds filter conditions to the query.
Supports more complex filtering operations than where().
Can handle comparison operators, arrays, and nested conditions.

#### Parameters

##### filters

`Record`\<`string`, `any`\>

Object containing filter conditions

#### Returns

[`RelationBuilder`](RelationBuilder.md)\<`T`\>

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

#### Inherited from

[`RelationBuilder`](RelationBuilder.md).[`filter`](RelationBuilder.md#filter)

***

### find()

> **find**(`id`): `Promise`\<`T`\>

Defined in: [RelationBuilder.ts:253](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/RelationBuilder.ts#L253)

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

#### Inherited from

[`RelationBuilder`](RelationBuilder.md).[`find`](RelationBuilder.md#find)

***

### id()

> **id**(`id`): `T`

Defined in: [RelationBuilder.ts:222](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/RelationBuilder.ts#L222)

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

#### Inherited from

[`RelationBuilder`](RelationBuilder.md).[`id`](RelationBuilder.md#id)

***

### limit()

> **limit**(`n`): [`RelationBuilder`](RelationBuilder.md)\<`T`\>

Defined in: [RelationBuilder.ts:393](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/RelationBuilder.ts#L393)

Limits the number of results returned.
Restricts the query to return at most n results.
Useful for pagination or limiting large result sets.

#### Parameters

##### n

`number`

The maximum number of results to return

#### Returns

[`RelationBuilder`](RelationBuilder.md)\<`T`\>

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

#### Inherited from

[`RelationBuilder`](RelationBuilder.md).[`limit`](RelationBuilder.md#limit)

***

### offset()

> **offset**(`n`): [`RelationBuilder`](RelationBuilder.md)\<`T`\>

Defined in: [RelationBuilder.ts:419](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/RelationBuilder.ts#L419)

Sets the offset for pagination in the query results.
Skips n records before starting to return results.
Often used with limit() for pagination.

#### Parameters

##### n

`number`

The number of records to skip

#### Returns

[`RelationBuilder`](RelationBuilder.md)\<`T`\>

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

#### Inherited from

[`RelationBuilder`](RelationBuilder.md).[`offset`](RelationBuilder.md#offset)

***

### orderBy()

> **orderBy**(`sort`, `direction`): [`RelationBuilder`](RelationBuilder.md)\<`T`\>

Defined in: [RelationBuilder.ts:366](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/RelationBuilder.ts#L366)

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

[`RelationBuilder`](RelationBuilder.md)\<`T`\>

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

#### Inherited from

[`RelationBuilder`](RelationBuilder.md).[`orderBy`](RelationBuilder.md#orderby)

***

### paginate()

> **paginate**(`page`, `perPage`): `Promise`\<`T`[]\>

Defined in: [HasManyRelationBuilder.ts:263](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/HasManyRelationBuilder.ts#L263)

Fetches a paginated list of related model instances.
Makes a GET request with pagination parameters.
Combines page number and size into limit/offset parameters.

#### Parameters

##### page

`number` = `1`

The page number to fetch (default: 1)

##### perPage

`number` = `10`

The number of items per page (default: 10)

#### Returns

`Promise`\<`T`[]\>

A promise that resolves to an array of related model instances

#### Throws

If the request fails

#### Example

```typescript
// Get first page with 20 items
const posts = await user.posts.paginate(1, 20);

// Get second page with default size
const posts = await user.posts.paginate(2);

// Get with filtering
const posts = await user.posts
  .where({ status: 'published' })
  .orderBy('created_at', 'desc')
  .paginate(2, 20);

// Paginate with error handling
try {
  const posts = await user.posts.paginate(2, 20);
  console.log(`Found ${posts.length} posts on page 2`);
} catch (error) {
  console.error('Error fetching posts:', error);
}

// Paginate in relationship chain
const user = await User.find(123);
const comments = await user.posts
  .find(456)
  .comments
  .paginate(2, 20);
```

***

### update()

> **update**\<`A`\>(`id`, `data`, `method`): `Promise`\<`T`\>

Defined in: [HasManyRelationBuilder.ts:212](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/HasManyRelationBuilder.ts#L212)

Updates a related model instance by ID.
Makes a PUT/PATCH request to update a specific related model.
Can use either PUT (full update) or PATCH (partial update).

#### Type Parameters

##### A

`A` *extends* `Partial`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### id

The ID of the model to update

`string` | `number`

##### data

`A`

The data to update the model with

##### method

The HTTP method to use (PUT or PATCH)

`"GET"` | `"POST"` | `"PUT"` | `"PATCH"` | `"DELETE"` | `"HEAD"` | `"OPTIONS"`

#### Returns

`Promise`\<`T`\>

A promise that resolves to the updated model instance

#### Throws

If the update fails

#### Example

```typescript
// Full update with PUT
const post = await user.posts.update(123, {
  title: 'Updated Title',
  content: 'Updated content',
  status: 'published'
});

// Partial update with PATCH
const post = await user.posts.update(123, {
  title: 'Updated Title'
}, Methods.PATCH);

// Update with error handling
try {
  const post = await user.posts.update(123, {
    title: 'Updated Title'
  });
  console.log('Post updated successfully');
} catch (error) {
  if (error.status === 404) {
    console.log('Post not found');
  } else if (error.status === 422) {
    console.log('Validation failed:', error.errors);
  } else {
    console.error('Error updating post:', error);
  }
}

// Update in relationship chain
const user = await User.find(123);
const comment = await user.posts
  .find(456)
  .comments
  .update(789, { content: 'Updated comment' });
```

***

### where()

> **where**(`where`): [`RelationBuilder`](RelationBuilder.md)\<`T`\>

Defined in: [RelationBuilder.ts:293](https://github.com/cedricpierre/fluentity-core/blob/ff4e4131c1b559350a048decc81f340aa7866d50/src/RelationBuilder.ts#L293)

Adds a where clause to the query.
Filters results based on exact field-value matches.
Multiple calls to where() will merge the conditions.

#### Parameters

##### where

`Record`\<`string`, `any`\>

Object containing field-value pairs to filter by

#### Returns

[`RelationBuilder`](RelationBuilder.md)\<`T`\>

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

#### Inherited from

[`RelationBuilder`](RelationBuilder.md).[`where`](RelationBuilder.md#where)
