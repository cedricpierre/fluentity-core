[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Model

# Class: Model\<T\>

Defined in: [Model.ts:60](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L60)

Base class for all models in the ORM.
Provides core functionality for interacting with the API and managing model data.
Handles CRUD operations, relationships, and query building.

Features:
- Automatic API request handling
- Relationship management
- Query building and filtering
- Data validation and transformation
- Dynamic property access

## Example

```typescript
// Basic model definition
class User extends Model<UserAttributes> {
  static resource = 'users';
}

// Model with relationships
class Post extends Model<PostAttributes> {
  static resource = 'posts';

  @HasOne(() => User)
  author: User;

  @HasMany(() => Comment)
  comments: Comment[];
}
```

## Type Parameters

### T

`T` *extends* [`Attributes`](../interfaces/Attributes.md) = [`Attributes`](../interfaces/Attributes.md)

The type of attributes this model will have, must extend Attributes

## Indexable

\[`key`: `string`\]: `any`

Index signature for dynamic properties.
Allows models to have additional properties beyond their defined attributes.

## Constructors

### Constructor

> **new Model**\<`T`\>(`attributes`, `parentQuery?`): `Model`\<`T`\>

Defined in: [Model.ts:114](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L114)

Creates a new model instance with the given attributes.
Initializes the query builder and sets up the model's state.
Can optionally accept an existing query builder instance.

#### Parameters

##### attributes

`T`

The attributes to initialize the model with

##### parentQuery?

[`QueryBuilder`](QueryBuilder.md)

Optional query builder instance to use instead of creating a new one

#### Returns

`Model`\<`T`\>

A new model instance

#### Throws

If required attributes are missing

#### Example

```typescript
// Create with basic attributes
const user = new User({ name: 'John', email: 'john@example.com' });

// Create with existing query builder
const query = new QueryBuilder().where({ status: 'active' });
const user = new User({ name: 'John' }, query);
```

## Properties

### id?

> `optional` **id**: `string` \| `number`

Defined in: [Model.ts:71](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L71)

Unique identifier for the model instance.
Can be either a string or number, depending on the API's ID format.

***

### resource

> `static` **resource**: `string`

Defined in: [Model.ts:93](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L93)

Resource endpoint for the model, used to construct API URLs.
Must be set by subclasses to define the API endpoint.

#### Example

```typescript
static resource = 'users';
```

***

### scopes?

> `static` `optional` **scopes**: `Record`\<`string`, (`query`) => [`RelationBuilder`](RelationBuilder.md)\<`any`\>\>

Defined in: [Model.ts:65](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L65)

Custom query scopes that can be applied to model queries.
Each scope is a function that modifies the query builder behavior.

## Methods

### delete()

> **delete**(): `Promise`\<`void`\>

Defined in: [Model.ts:669](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L669)

Deletes the model instance from the server.
Sends a DELETE request to remove the record.
The local instance remains but becomes detached from the server.

#### Returns

`Promise`\<`void`\>

Promise that resolves when the deletion is complete

#### Throws

If the deletion fails

#### Example

```typescript
// Delete the user
await user.delete();

// Delete with error handling
try {
  await user.delete();
  console.log('User deleted successfully');
} catch (error) {
  if (error.status === 404) {
    console.log('User no longer exists');
  } else {
    console.error('Error deleting user:', error);
  }
}
```

***

### get()

> **get**(): `Promise`\<`Model`\<`T`\>\>

Defined in: [Model.ts:542](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L542)

Retrieves the current model instance from the server.
Updates the local instance with fresh data from the API.
Useful for refreshing model data or after updates.

#### Returns

`Promise`\<`Model`\<`T`\>\>

Promise resolving to the updated model instance

#### Throws

If the record is not found

#### Example

```typescript
// Refresh user data
await user.get();
console.log(`User name: ${user.name}`);

// Refresh with error handling
try {
  await user.get();
  console.log('User data refreshed');
} catch (error) {
  if (error.status === 404) {
    console.log('User no longer exists');
  } else {
    console.error('Error refreshing user:', error);
  }
}
```

***

### reset()

> **reset**(...`keys`): `this`

Defined in: [Model.ts:755](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L755)

Resets properties on the model, setting them to undefined.
This is useful for clearing relationships or properties.

#### Parameters

##### keys

...`string`[]

The property keys to reset (accepts multiple keys)

#### Returns

`this`

The model instance for method chaining

#### Example

```typescript
// reset a relationship
user.reset('address');
// Now user.address is undefined

// reset multiple properties
user.reset('address', 'profile');
```

***

### save()

> **save**(): `Promise`\<`Model`\<`T`\>\>

Defined in: [Model.ts:581](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L581)

Saves the current model instance to the server.
Creates a new record if the model doesn't have an ID, updates existing record otherwise.
Automatically determines whether to use POST or PUT/PATCH.

#### Returns

`Promise`\<`Model`\<`T`\>\>

Promise resolving to the saved model instance

#### Throws

If the save operation fails

#### Example

```typescript
// Create a new user
const user = new User({ name: 'John', email: 'john@example.com' });
await user.save();

// Update existing user
user.name = 'John Doe';
await user.save();

// Save with error handling
try {
  await user.save();
  console.log(`User saved with ID: ${user.id}`);
} catch (error) {
  if (error.status === 422) {
    console.log('Validation failed:', error.errors);
  } else {
    console.error('Error saving user:', error);
  }
}
```

***

### toObject()

> **toObject**(): `Record`\<`string`, `any`\>

Defined in: [Model.ts:716](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L716)

Converts the model instance to a plain object.
Recursively converts nested model instances to plain objects.
Useful for serialization or sending data to the server.

#### Returns

`Record`\<`string`, `any`\>

A plain object representation of the model's attributes

#### Example

```typescript
// Convert to plain object
const userData = user.toObject();
console.log(JSON.stringify(userData));

// Convert with nested models
const post = await Post.find(123);
const postData = post.toObject();
// {
//   id: 123,
//   title: 'My Post',
//   author: {
//     id: 456,
//     name: 'John Doe'
//   },
//   comments: [
//     { id: 789, content: 'Great post!' }
//   ]
// }
```

***

### update()

> **update**(`attributes?`, `method?`): `Promise`\<`Model`\<`T`\>\>

Defined in: [Model.ts:631](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L631)

Updates the model instance with new attributes and saves to the server.
Can use either PUT (full update) or PATCH (partial update).
Updates the local instance with the server response.

#### Parameters

##### attributes?

`Partial`\<`T`\>

Optional attributes to update before saving

##### method?

The HTTP method to use for the update (PUT or PATCH)

`"GET"` | `"POST"` | `"PUT"` | `"PATCH"` | `"DELETE"` | `"HEAD"` | `"OPTIONS"`

#### Returns

`Promise`\<`Model`\<`T`\>\>

Promise resolving to the updated model instance

#### Throws

If the update fails

#### Example

```typescript
// Full update with PUT
await user.update({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
});

// Partial update with PATCH
await user.update({
  name: 'John Doe'
}, Methods.PATCH);

// Update with error handling
try {
  await user.update({ name: 'John Doe' });
  console.log(`User updated: ${user.name}`);
} catch (error) {
  if (error.status === 404) {
    console.log('User no longer exists');
  } else if (error.status === 422) {
    console.log('Validation failed:', error.errors);
  } else {
    console.error('Error updating user:', error);
  }
}
```

***

### all()

> `static` **all**\<`T`\>(`this`): `Promise`\<`T`[]\>

Defined in: [Model.ts:341](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L341)

Retrieves all records for the model.
Fetches all records from the API without any filtering.
Use with caution for large datasets - consider using pagination.

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

#### Returns

`Promise`\<`T`[]\>

Promise resolving to an array of model instances

#### Example

```typescript
// Get all users
const allUsers = await User.all();

// Get all users with error handling
try {
  const users = await User.all();
  console.log(`Found ${users.length} users`);
} catch (error) {
  console.error('Failed to fetch users:', error);
}
```

***

### call()

> `static` **call**(`queryBuilder`): `Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\>

Defined in: [Model.ts:684](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L684)

#### Parameters

##### queryBuilder

[`QueryBuilder`](QueryBuilder.md)

#### Returns

`Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\>

***

### create()

> `static` **create**\<`A`, `T`\>(`this`, `data`): `Promise`\<`T`\>

Defined in: [Model.ts:417](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L417)

Creates a new record.
Sends a POST request to create a new record in the API.
Returns the created record with any server-generated fields.

#### Type Parameters

##### A

`A` *extends* `Partial`\<[`Attributes`](../interfaces/Attributes.md)\>

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### data

`A`

The data to create the record with

#### Returns

`Promise`\<`T`\>

Promise resolving to the created model instance

#### Throws

If the creation fails

#### Example

```typescript
// Create a new user
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
});

// Create with error handling
try {
  const user = await User.create({
    name: 'John Doe',
    email: 'john@example.com'
  });
  console.log(`Created user with ID: ${user.id}`);
} catch (error) {
  if (error.status === 422) {
    console.log('Validation failed:', error.errors);
  } else {
    console.error('Error creating user:', error);
  }
}
```

***

### delete()

> `static` **delete**\<`T`\>(`this`, `id`): `Promise`\<`void`\>

Defined in: [Model.ts:506](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L506)

Deletes a record by ID.
Sends a DELETE request to remove a record from the API.
Returns void on success, throws an error on failure.

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### id

The ID of the record to delete

`string` | `number`

#### Returns

`Promise`\<`void`\>

Promise that resolves when the deletion is complete

#### Throws

If the deletion fails

#### Example

```typescript
// Delete a user
await User.delete(123);

// Delete with error handling
try {
  await User.delete(123);
  console.log('User deleted successfully');
} catch (error) {
  if (error.status === 404) {
    console.log('User not found');
  } else {
    console.error('Error deleting user:', error);
  }
}
```

***

### filter()

> `static` **filter**\<`T`\>(`this`, `filters`): [`HasManyRelationBuilder`](HasManyRelationBuilder.md)\<`T`\>

Defined in: [Model.ts:311](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L311)

Starts a query with filter conditions.
Similar to where() but specifically for filter operations.
Supports more complex filtering operations and operators.

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### filters

`Record`\<`string`, `any`\>

Filter conditions to apply, as field-value pairs

#### Returns

[`HasManyRelationBuilder`](HasManyRelationBuilder.md)\<`T`\>

A HasManyRelationBuilder instance with filters applied

#### Example

```typescript
// Comparison operators
const users = await User.filter({
  age: { gt: 18, lt: 65 },
  score: { gte: 1000 }
}).all();

// Array conditions
const users = await User.filter({
  role: { in: ['admin', 'moderator'] },
  status: ['active', 'pending']
}).all();

// Nested conditions
const users = await User.filter({
  profile: {
    verified: true,
    location: { ne: 'unknown' }
  }
}).all();
```

***

### find()

> `static` **find**\<`T`\>(`this`, `id`): `Promise`\<`T`\>

Defined in: [Model.ts:374](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L374)

Finds a single record by ID.
Fetches a specific record from the API by its ID.
Throws an error if the record is not found.

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### id

The ID of the record to find

`string` | `number`

#### Returns

`Promise`\<`T`\>

Promise resolving to a model instance

#### Throws

If the record is not found

#### Example

```typescript
// Find a user by ID
const user = await User.find(123);

// Find with error handling
try {
  const user = await User.find(123);
  console.log(`Found user: ${user.name}`);
} catch (error) {
  if (error.status === 404) {
    console.log('User not found');
  } else {
    console.error('Error fetching user:', error);
  }
}
```

***

### id()

> `static` **id**\<`T`\>(`this`, `id`): `T`

Defined in: [Model.ts:217](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L217)

Creates a new model instance with the given ID.
Useful for creating model instances when only the ID is known.
The instance can be used for operations that only require the ID.

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### id

The ID to assign to the new model instance

`string` | `number`

#### Returns

`T`

A new model instance with the specified ID

#### Example

```typescript
// Create a reference to an existing user
const user = User.id(123);
await user.get(); // Fetch full user data

// Use for relationship operations
const post = await Post.create({
  title: 'New Post',
  author: User.id(123)
});
```

***

### query()

> `static` **query**\<`T`\>(`this`): [`HasManyRelationBuilder`](HasManyRelationBuilder.md)\<`T`\>

Defined in: [Model.ts:247](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L247)

Starts a new query builder for the model.
Returns a HasManyRelationBuilder for querying multiple records.
Provides a fluent interface for building complex queries.

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

#### Returns

[`HasManyRelationBuilder`](HasManyRelationBuilder.md)\<`T`\>

A HasManyRelationBuilder instance for building queries

#### Example

```typescript
// Basic query with filters
const users = await User.query()
  .where({ status: 'active' })
  .orderBy('created_at', 'desc')
  .all();

// Complex query with multiple conditions
const users = await User.query()
  .filter({
    age: { gt: 18 },
    role: ['admin', 'moderator']
  })
  .orderBy('name', 'asc')
  .limit(50)
  .offset(100)
  .all();
```

***

### update()

> `static` **update**\<`A`, `T`\>(`this`, `id`, `data`, `method`): `Promise`\<`T`\>

Defined in: [Model.ts:468](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L468)

Updates an existing record.
Sends a PUT/PATCH request to update a record in the API.
Can use either PUT (full update) or PATCH (partial update).

#### Type Parameters

##### A

`A` *extends* `Partial`\<[`Attributes`](../interfaces/Attributes.md)\>

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### id

The ID of the record to update

`string` | `number`

##### data

`A`

The data to update the record with

##### method

The HTTP method to use for the update (PUT or PATCH)

`"GET"` | `"POST"` | `"PUT"` | `"PATCH"` | `"DELETE"` | `"HEAD"` | `"OPTIONS"`

#### Returns

`Promise`\<`T`\>

Promise resolving to the updated model instance

#### Throws

If the update fails

#### Example

```typescript
// Full update with PUT
const user = await User.update(123, {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
});

// Partial update with PATCH
const user = await User.update(123, {
  name: 'John Doe'
}, Methods.PATCH);

// Update with error handling
try {
  const user = await User.update(123, {
    email: 'new@example.com'
  });
  console.log(`Updated user: ${user.name}`);
} catch (error) {
  if (error.status === 404) {
    console.log('User not found');
  } else if (error.status === 422) {
    console.log('Validation failed:', error.errors);
  } else {
    console.error('Error updating user:', error);
  }
}
```

***

### where()

> `static` **where**\<`T`\>(`this`, `where`): [`HasManyRelationBuilder`](HasManyRelationBuilder.md)\<`T`\>

Defined in: [Model.ts:271](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/Model.ts#L271)

Starts a query with a where clause.
Shorthand for query().where() for common filtering operations.
Useful for simple equality-based queries.

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### where

`Partial`\<[`Attributes`](../interfaces/Attributes.md)\>

Conditions to filter by, as field-value pairs

#### Returns

[`HasManyRelationBuilder`](HasManyRelationBuilder.md)\<`T`\>

A HasManyRelationBuilder instance with where conditions applied

#### Example

```typescript
// Simple equality conditions
const activeUsers = await User.where({ active: true }).all();

// Multiple conditions
const users = await User.where({
  role: 'admin',
  status: 'active',
  verified: true
}).all();
```
