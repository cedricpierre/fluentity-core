[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Model

# Class: Model\<T\>

Defined in: [Model.ts:33](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L33)

Base class for all models in the ORM.
Provides core functionality for interacting with the API and managing model data.
Handles CRUD operations, relationships, and query building.

## Example

```typescript
class User extends Model<UserAttributes> {
  static resource = 'users';
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

> **new Model**\<`T`\>(`attributes`, `queryBuilder?`): `Model`\<`T`\>

Defined in: [Model.ts:79](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L79)

Creates a new model instance with the given attributes.
Initializes the query builder and sets up the model's state.

#### Parameters

##### attributes

`T`

The attributes to initialize the model with

##### queryBuilder?

[`QueryBuilder`](QueryBuilder.md)

Optional query builder instance to use instead of creating a new one

#### Returns

`Model`\<`T`\>

A new model instance

#### Throws

If required attributes are missing

## Properties

### id?

> `optional` **id**: `string` \| `number`

Defined in: [Model.ts:45](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L45)

Unique identifier for the model instance.
Can be either a string or number, depending on the API's ID format.

***

### resource

> `static` **resource**: `string`

Defined in: [Model.ts:68](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L68)

Resource endpoint for the model, used to construct API URLs.
Must be set by subclasses to define the API endpoint.

#### Static

#### Example

```typescript
static resource = 'users';
```

***

### scopes?

> `static` `optional` **scopes**: `Record`\<`string`, (`query`) => [`RelationBuilder`](RelationBuilder.md)\<`any`\>\>

Defined in: [Model.ts:39](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L39)

Custom query scopes that can be applied to model queries.
Each scope is a function that modifies the query builder behavior.

#### Static

## Methods

### delete()

> **delete**(): `Promise`\<`void`\>

Defined in: [Model.ts:399](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L399)

Deletes the model instance from the server.

#### Returns

`Promise`\<`void`\>

Promise that resolves when the deletion is complete

#### Throws

If the deletion fails

#### Example

```typescript
await user.delete();
```

***

### get()

> **get**(): `Promise`\<`Model`\<`T`\>\>

Defined in: [Model.ts:332](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L332)

Retrieves the current model instance from the server.
Updates the local instance with fresh data from the API.

#### Returns

`Promise`\<`Model`\<`T`\>\>

Promise resolving to the updated model instance

#### Throws

If the record is not found

#### Example

```typescript
await user.get(); // Refreshes user data from the server
```

***

### save()

> **save**(): `Promise`\<`Model`\<`T`\>\>

Defined in: [Model.ts:353](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L353)

Saves the current model instance to the server.
Creates a new record if the model doesn't have an ID, updates existing record otherwise.

#### Returns

`Promise`\<`Model`\<`T`\>\>

Promise resolving to the saved model instance

#### Throws

If the save operation fails

#### Example

```typescript
user.name = 'John Doe';
await user.save(); // Creates or updates the user
```

***

### toObject()

> **toObject**(): `Record`\<`string`, `any`\>

Defined in: [Model.ts:428](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L428)

Converts the model instance to a plain object.
Recursively converts nested model instances to plain objects.

#### Returns

`Record`\<`string`, `any`\>

A plain object representation of the model's attributes

#### Example

```typescript
const userData = user.toObject();
```

***

### update()

> **update**(`attributes?`, `method?`): `Promise`\<`Model`\<`T`\>\>

Defined in: [Model.ts:377](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L377)

Updates the model instance with new attributes and saves to the server.

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
await user.update({ name: 'John Doe' });
```

***

### all()

> `static` **all**\<`T`\>(`this`): `Promise`\<`T`[]\>

Defined in: [Model.ts:218](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L218)

Retrieves all records for the model.
Fetches all records from the API without any filtering.

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

#### Returns

`Promise`\<`T`[]\>

Promise resolving to an array of model instances

#### Static

#### Example

```typescript
const allUsers = await User.all();
```

***

### call()

> `static` **call**(`queryBuilder`): `Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\>

Defined in: [Model.ts:414](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L414)

#### Parameters

##### queryBuilder

[`QueryBuilder`](QueryBuilder.md)

#### Returns

`Promise`\<[`AdapterResponse`](../interfaces/AdapterResponse.md)\>

***

### create()

> `static` **create**\<`A`, `T`\>(`this`, `data`): `Promise`\<`T`\>

Defined in: [Model.ts:261](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L261)

Creates a new record.
Sends a POST request to create a new record in the API.

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

#### Static

#### Example

```typescript
const user = await User.create({ name: 'John', email: 'john@example.com' });
```

***

### delete()

> `static` **delete**\<`T`\>(`this`, `id`): `Promise`\<`void`\>

Defined in: [Model.ts:311](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L311)

Deletes a record by ID.
Sends a DELETE request to remove a record from the API.

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

#### Static

#### Example

```typescript
await User.delete(123);
```

***

### filter()

> `static` **filter**\<`T`\>(`this`, `filters`): `HasManyRelationBuilder`\<`T`\>

Defined in: [Model.ts:197](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L197)

Starts a query with filter conditions.
Similar to where() but specifically for filter operations.

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

`HasManyRelationBuilder`\<`T`\>

A HasManyRelationBuilder instance with filters applied

#### Static

#### Example

```typescript
const users = await User.filter({ age: { gt: 18 } }).all();
```

***

### find()

> `static` **find**\<`T`\>(`this`, `id`): `Promise`\<`T`\>

Defined in: [Model.ts:238](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L238)

Finds a single record by ID.
Fetches a specific record from the API by its ID.

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

#### Static

#### Example

```typescript
const user = await User.find(123);
```

***

### id()

> `static` **id**\<`T`\>(`this`, `id`): `T`

Defined in: [Model.ts:144](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L144)

Creates a new model instance with the given ID.
Useful for creating model instances when only the ID is known.

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

#### Static

#### Example

```typescript
const user = User.id(123);
```

***

### query()

> `static` **query**\<`T`\>(`this`): `HasManyRelationBuilder`\<`T`\>

Defined in: [Model.ts:159](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L159)

Starts a new query builder for the model.
Returns a HasManyRelationBuilder for querying multiple records.

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

#### Returns

`HasManyRelationBuilder`\<`T`\>

A HasManyRelationBuilder instance for building queries

#### Static

#### Example

```typescript
const users = await User.query().where({ active: true }).all();
```

***

### update()

> `static` **update**\<`A`, `T`\>(`this`, `id`, `data`, `method`): `Promise`\<`T`\>

Defined in: [Model.ts:286](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L286)

Updates an existing record.
Sends a PUT/PATCH request to update a record in the API.

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

#### Static

#### Example

```typescript
const user = await User.update(123, { name: 'John Doe' });
```

***

### where()

> `static` **where**\<`T`\>(`this`, `where`): `HasManyRelationBuilder`\<`T`\>

Defined in: [Model.ts:175](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/Model.ts#L175)

Starts a query with a where clause.
Shorthand for query().where() for common filtering operations.

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

`HasManyRelationBuilder`\<`T`\>

A HasManyRelationBuilder instance with where conditions applied

#### Static

#### Example

```typescript
const activeUsers = await User.where({ active: true }).all();
```
