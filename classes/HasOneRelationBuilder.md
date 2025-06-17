[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / HasOneRelationBuilder

# Class: HasOneRelationBuilder\<T\>

Defined in: [HasOneRelationBuilder.ts:31](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/HasOneRelationBuilder.ts#L31)

Builder class for has-one relationships between models.
Provides methods for managing a one-to-one relationship with another model.
Used when a model has exactly one related model instance.

Features:
- Single model retrieval
- Model updates
- Model deletion
- Relationship traversal

## Example

```typescript
// Basic usage in a model
class User extends Model {
  @HasOne(() => Profile)
  profile: Profile;
}

// Usage in queries
const profile = await user.profile.get();
await user.profile.update({ bio: 'New bio' });
await user.profile.delete();
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

> **new HasOneRelationBuilder**\<`T`\>(`model`, `parentQuery?`): `HasOneRelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:131](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/RelationBuilder.ts#L131)

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

`HasOneRelationBuilder`\<`T`\>

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

Defined in: [RelationBuilder.ts:161](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/RelationBuilder.ts#L161)

Gets the data associated with this relation builder.
Returns T[] if T is an array type, otherwise returns T.

##### Returns

[`RelationData`](../type-aliases/RelationData.md)\<`T`, `this`\>

#### Set Signature

> **set** **data**(`value`): `void`

Defined in: [RelationBuilder.ts:169](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/RelationBuilder.ts#L169)

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

### delete()

> **delete**(): `Promise`\<`void`\>

Defined in: [HasOneRelationBuilder.ts:147](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/HasOneRelationBuilder.ts#L147)

Deletes the related model instance.
Makes a DELETE request to remove the single related model.
The local instance remains but becomes detached from the server.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the deletion is complete

#### Throws

If the deletion fails

#### Example

```typescript
// Delete the profile
await user.profile.delete();

// Delete with error handling
try {
  await user.profile.delete();
  console.log('Profile deleted successfully');
} catch (error) {
  if (error.status === 404) {
    console.log('Profile not found');
  } else {
    console.error('Error deleting profile:', error);
  }
}

// Delete in relationship chain
const post = await user.posts.find(123);
await post.author.profile.delete();
```

***

### filter()

> **filter**(`filters`): [`RelationBuilder`](RelationBuilder.md)\<`T`\>

Defined in: [RelationBuilder.ts:334](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/RelationBuilder.ts#L334)

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

Defined in: [RelationBuilder.ts:253](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/RelationBuilder.ts#L253)

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

### get()

> **get**(): `Promise`\<`T`\>

Defined in: [HasOneRelationBuilder.ts:62](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/HasOneRelationBuilder.ts#L62)

Fetches the related model instance.
Makes a GET request to retrieve the single related model.
Throws an error if the related model is not found.

#### Returns

`Promise`\<`T`\>

A promise that resolves to the related model instance

#### Throws

If the related model is not found

#### Example

```typescript
// Get user's profile
const profile = await user.profile.get();
console.log(`Profile bio: ${profile.bio}`);

// Get with error handling
try {
  const profile = await user.profile.get();
  console.log('Profile loaded successfully');
} catch (error) {
  if (error.status === 404) {
    console.log('Profile not found');
  } else {
    console.error('Error loading profile:', error);
  }
}

// Use in relationship chain
const post = await user.posts.find(123);
const authorProfile = await post.author.profile.get();
```

***

### id()

> **id**(`id`): `T`

Defined in: [RelationBuilder.ts:222](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/RelationBuilder.ts#L222)

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

Defined in: [RelationBuilder.ts:393](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/RelationBuilder.ts#L393)

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

Defined in: [RelationBuilder.ts:419](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/RelationBuilder.ts#L419)

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

Defined in: [RelationBuilder.ts:366](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/RelationBuilder.ts#L366)

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

### update()

> **update**\<`A`\>(`data`, `method`): `Promise`\<`T`\>

Defined in: [HasOneRelationBuilder.ts:108](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/HasOneRelationBuilder.ts#L108)

Updates the related model instance.
Makes a PUT/PATCH request to update the single related model.
Can use either PUT (full update) or PATCH (partial update).

#### Type Parameters

##### A

`A` *extends* `Partial`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### data

`A`

The data to update the related model with

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
const profile = await user.profile.update({
  bio: 'New bio',
  location: 'New York',
  website: 'https://example.com'
});

// Partial update with PATCH
const profile = await user.profile.update({
  bio: 'Updated bio'
}, Methods.PATCH);

// Update with error handling
try {
  const profile = await user.profile.update({
    bio: 'New bio'
  });
  console.log('Profile updated successfully');
} catch (error) {
  if (error.status === 404) {
    console.log('Profile not found');
  } else if (error.status === 422) {
    console.log('Validation failed:', error.errors);
  } else {
    console.error('Error updating profile:', error);
  }
}
```

***

### where()

> **where**(`where`): [`RelationBuilder`](RelationBuilder.md)\<`T`\>

Defined in: [RelationBuilder.ts:293](https://github.com/cedricpierre/fluentity-core/blob/b9e907b503f5d8cbc83b38cdb5626da057589278/src/RelationBuilder.ts#L293)

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
