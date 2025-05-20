[**Fluentity Core Documentation**](../README.md)

***

[Fluentity Core Documentation](../globals.md) / Model

# Class: Model\<T\>

Defined in: [Model.ts:22](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L22)

Base class for all models in the ORM.
Provides core functionality for interacting with the API and managing model data.

## Type Parameters

### T

`T` *extends* [`Attributes`](../interfaces/Attributes.md) = [`Attributes`](../interfaces/Attributes.md)

The type of attributes this model will have

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### Constructor

> **new Model**\<`T`\>(`attributes`): `Model`\<`T`\>

Defined in: [Model.ts:42](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L42)

Creates a new model instance with the given attributes.

#### Parameters

##### attributes

`T`

The attributes to initialize the model with

#### Returns

`Model`\<`T`\>

A new model instance

## Properties

### id?

> `optional` **id**: `string` \| `number`

Defined in: [Model.ts:28](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L28)

Unique identifier for the model instance

***

### resource

> `static` **resource**: `string`

Defined in: [Model.ts:32](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L32)

Resource endpoint for the model

***

### scopes?

> `static` `optional` **scopes**: `Record`\<`string`, (`query`) => [`RelationBuilder`](RelationBuilder.md)\<`any`\>\>

Defined in: [Model.ts:24](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L24)

Custom query scopes that can be applied to model queries

## Accessors

### path

#### Get Signature

> **get** **path**(): `string`

Defined in: [Model.ts:60](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L60)

Gets the current path for the model instance.
The path represents the API endpoint for this model.

##### Returns

`string`

#### Set Signature

> **set** **path**(`path`): `void`

Defined in: [Model.ts:68](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L68)

Sets the path for the model instance.

##### Parameters

###### path

`string`

New path value to set

##### Returns

`void`

## Methods

### delete()

> **delete**(): `Promise`\<`void`\>

Defined in: [Model.ts:239](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L239)

Deletes the current model instance from the API.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the deletion is complete

#### Throws

Error if the model has no ID

***

### get()

> **get**(): `Promise`\<`Model`\<`T`\>\>

Defined in: [Model.ts:185](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L185)

Retrieves the current model instance from the server

#### Returns

`Promise`\<`Model`\<`T`\>\>

Promise resolving to the updated model instance

***

### save()

> **save**(): `Promise`\<`Model`\<`T`\>\>

Defined in: [Model.ts:202](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L202)

Saves the current model instance to the API.
Creates a new record if the model has no ID, updates existing record otherwise.

#### Returns

`Promise`\<`Model`\<`T`\>\>

A promise that resolves to the saved model instance

***

### toObject()

> **toObject**(): `Record`\<`string`, `any`\>

Defined in: [Model.ts:252](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L252)

Converts the model instance to a plain object
Handles nested model instances and arrays of models

#### Returns

`Record`\<`string`, `any`\>

A plain object representation of the model

***

### update()

> **update**(`attributes?`): `Promise`\<`Model`\<`T`\>\>

Defined in: [Model.ts:222](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L222)

Updates the current model instance with new attributes.

#### Parameters

##### attributes?

`Partial`\<`T`\>

The attributes to update

#### Returns

`Promise`\<`Model`\<`T`\>\>

A promise that resolves to the updated model instance

***

### all()

> `static` **all**\<`T`\>(`this`): `Promise`\<`T`[]\>

Defined in: [Model.ts:140](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L140)

Retrieves all records for the model

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

#### Returns

`Promise`\<`T`[]\>

Promise resolving to an array of model instances

***

### create()

> `static` **create**\<`A`, `T`\>(`this`, `data`): `Promise`\<`T`\>

Defined in: [Model.ts:158](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L158)

Creates a new record

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

***

### delete()

> `static` **delete**\<`T`\>(`this`, `id`): `Promise`\<`void`\>

Defined in: [Model.ts:177](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L177)

Deletes a record by ID

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

***

### filter()

> `static` **filter**\<`T`\>(`this`, `filters`): `HasManyRelationBuilder`\<`T`\>

Defined in: [Model.ts:123](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L123)

Starts a query with filter conditions

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### filters

`Record`\<`string`, `any`\>

Filter conditions to apply

#### Returns

`HasManyRelationBuilder`\<`T`\>

A HasManyRelationBuilder instance with filters applied

***

### find()

> `static` **find**\<`T`\>(`this`, `id`): `Promise`\<`T`\>

Defined in: [Model.ts:149](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L149)

Finds a single record by ID

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### id

The ID to find

`string` | `number`

#### Returns

`Promise`\<`T`\>

Promise resolving to a model instance

***

### id()

> `static` **id**\<`T`\>(`this`, `id`): `T`

Defined in: [Model.ts:97](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L97)

Creates a new model instance with the given ID.

#### Type Parameters

##### T

`T` *extends* `Model`\<`any`\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### id

The ID to assign to the new model instance

`string` | `number`

#### Returns

`T`

A new model instance with the specified ID

***

### include()

> `static` **include**\<`T`\>(`this`, `relations`): `HasManyRelationBuilder`\<`T`\>

Defined in: [Model.ts:132](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L132)

Starts a query with relations to include

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### relations

Single relation or array of relations to include

`string` | `string`[]

#### Returns

`HasManyRelationBuilder`\<`T`\>

A HasManyRelationBuilder instance with relations included

***

### query()

> `static` **query**\<`T`\>(`this`): `HasManyRelationBuilder`\<`T`\>

Defined in: [Model.ts:105](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L105)

Starts a new query builder for the model

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

#### Returns

`HasManyRelationBuilder`\<`T`\>

A HasManyRelationBuilder instance

***

### update()

> `static` **update**\<`A`, `T`\>(`this`, `id`, `data`): `Promise`\<`T`\>

Defined in: [Model.ts:168](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L168)

Updates an existing record

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

#### Returns

`Promise`\<`T`\>

Promise resolving to the updated model instance

***

### where()

> `static` **where**\<`T`\>(`this`, `where`): `HasManyRelationBuilder`\<`T`\>

Defined in: [Model.ts:114](https://github.com/cedricpierre/fluentity-core/blob/67e692bbd289864a7426aa17449637a48dccd630/src/Model.ts#L114)

Starts a query with a where clause

#### Type Parameters

##### T

`T` *extends* `Model`\<[`Attributes`](../interfaces/Attributes.md)\>

#### Parameters

##### this

[`Constructor`](../type-aliases/Constructor.md)\<`T`\>

##### where

`Partial`\<[`Attributes`](../interfaces/Attributes.md)\>

Conditions to filter by

#### Returns

`HasManyRelationBuilder`\<`T`\>

A HasManyRelationBuilder instance with where conditions applied
