[**Fluentity Core Documentation**](../README.md)

***

[Fluentity Core Documentation](../globals.md) / RelationBuilder

# Class: RelationBuilder\<T\>

Defined in: [RelationBuilder.ts:22](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/RelationBuilder.ts#L22)

Base class for building and managing relationships between models.
Provides methods for querying related models and building API requests.

## Type Parameters

### T

`T` *extends* [`Model`](Model.md)\<`any`\>

The type of model this relation builder works with

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### Constructor

> **new RelationBuilder**\<`T`\>(`model`, `urlQueryBuilder?`, `initialPath?`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:36](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/RelationBuilder.ts#L36)

Creates a new relation builder instance.

#### Parameters

##### model

() => [`Model`](Model.md)\<`any`\>

Factory function that returns a model instance

##### urlQueryBuilder?

`URLQueryBuilder`

Optional query builder instance

##### initialPath?

`string`

Optional initial path for the relation

#### Returns

`RelationBuilder`\<`T`\>

## Methods

### filter()

> **filter**(`filters`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:100](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/RelationBuilder.ts#L100)

Adds filter conditions to the query.

#### Parameters

##### filters

`Record`\<`string`, `any`\>

Object containing filter conditions

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for chaining

***

### find()

> **find**(`id`): `Promise`\<`T`\>

Defined in: [RelationBuilder.ts:75](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/RelationBuilder.ts#L75)

Fetches a model instance by ID from the API.

#### Parameters

##### id

The ID of the model to fetch

`string` | `number`

#### Returns

`Promise`\<`T`\>

A promise that resolves to the fetched model instance

***

### id()

> **id**(`id`): `T`

Defined in: [RelationBuilder.ts:64](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/RelationBuilder.ts#L64)

Gets a model instance by ID without making an API request.

#### Parameters

##### id

The ID of the model to get

`string` | `number`

#### Returns

`T`

A new model instance with the given ID

***

### include()

> **include**(`relations`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:110](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/RelationBuilder.ts#L110)

Specifies relations to include in the response.

#### Parameters

##### relations

Single relation name or array of relation names to include

`string` | `string`[]

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for chaining

***

### limit()

> **limit**(`n`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:131](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/RelationBuilder.ts#L131)

Limits the number of results returned.

#### Parameters

##### n

`number`

The maximum number of results to return

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for chaining

***

### offset()

> **offset**(`n`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:136](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/RelationBuilder.ts#L136)

#### Parameters

##### n

`number`

#### Returns

`RelationBuilder`\<`T`\>

***

### orderBy()

> **orderBy**(`field`, `dir`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:121](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/RelationBuilder.ts#L121)

Adds an order by clause to the query.

#### Parameters

##### field

`string`

The field to order by

##### dir

`string` = `'asc'`

The direction to order in ('asc' or 'desc')

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for chaining

***

### where()

> **where**(`where`): `RelationBuilder`\<`T`\>

Defined in: [RelationBuilder.ts:90](https://github.com/cedricpierre/fluentity-core/blob/8e2af2c49efe8e91127ddf71a1f873baf08b923d/src/RelationBuilder.ts#L90)

Adds a where clause to the query.

#### Parameters

##### where

`Record`\<`string`, `any`\>

Object containing field-value pairs to filter by

#### Returns

`RelationBuilder`\<`T`\>

The relation builder instance for chaining
