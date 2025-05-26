[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / QueryBuilder

# Class: QueryBuilder

Defined in: [QueryBuilder.ts:31](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L31)

Builder class for constructing URL query strings and API requests.
Provides methods for building and managing query parameters for API requests.
Used internally by models and relation builders to construct API calls.

## Example

```typescript
const query = new QueryBuilder()
  .where({ status: 'active' })
  .orderBy('created_at', 'desc')
  .limit(10);
```

## Constructors

### Constructor

> **new QueryBuilder**(`options?`): `QueryBuilder`

Defined in: [QueryBuilder.ts:32](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L32)

#### Parameters

##### options?

`QueryBuilderOptions`

#### Returns

`QueryBuilder`

## Properties

### body?

> `optional` **body**: `any`

Defined in: [QueryBuilder.ts:60](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L60)

Request body data

***

### direction?

> `optional` **direction**: `string`

Defined in: [QueryBuilder.ts:48](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L48)

Sort direction ('asc' or 'desc')

***

### id?

> `optional` **id**: `string` \| `number`

Defined in: [QueryBuilder.ts:40](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L40)

Resource ID for single-resource operations

***

### limit?

> `optional` **limit**: `number`

Defined in: [QueryBuilder.ts:50](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L50)

Maximum number of results to return

***

### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"` \| `"HEAD"` \| `"OPTIONS"`

Defined in: [QueryBuilder.ts:58](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L58)

HTTP method to use for the request

***

### offset?

> `optional` **offset**: `number`

Defined in: [QueryBuilder.ts:52](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L52)

Number of results to skip

***

### page?

> `optional` **page**: `number`

Defined in: [QueryBuilder.ts:54](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L54)

Page number for pagination

***

### parent?

> `optional` **parent**: `QueryBuilder`

Defined in: [QueryBuilder.ts:42](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L42)

The parents of the query builder

***

### perPage?

> `optional` **perPage**: `number`

Defined in: [QueryBuilder.ts:56](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L56)

Number of items per page

***

### query?

> `optional` **query**: `Record`\<`string`, `any`\> = `{}`

Defined in: [QueryBuilder.ts:44](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L44)

Query parameters to be added to the URL

***

### resource?

> `optional` **resource**: `string`

Defined in: [QueryBuilder.ts:38](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L38)

The resource name for the API endpoint

***

### sort?

> `optional` **sort**: `string`

Defined in: [QueryBuilder.ts:46](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L46)

Field to sort results by

## Methods

### filter()

> **filter**(`filters`): `this`

Defined in: [QueryBuilder.ts:92](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L92)

Adds filter conditions to the query.
Supports more complex filtering operations than where().

#### Parameters

##### filters

`Record`\<`string`, `any`\>

Object containing filter conditions

#### Returns

`this`

The QueryBuilder instance for chaining

#### Example

```typescript
query.filter({
  age: { gt: 18, lt: 65 },
  status: ['active', 'pending']
});
```

***

### reset()

> **reset**(): `this`

Defined in: [QueryBuilder.ts:108](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L108)

Resets the query builder to its initial state.
Clears all query parameters and options.

#### Returns

`this`

The QueryBuilder instance for chaining

#### Example

```typescript
query.reset(); // Clear all query parameters
```

***

### toObject()

> **toObject**(): `Record`\<`string`, `any`\>

Defined in: [QueryBuilder.ts:132](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L132)

Converts the query builder to a plain object.
Used internally to construct the final query parameters.

#### Returns

`Record`\<`string`, `any`\>

A plain object containing all non-undefined query parameters

#### Example

```typescript
const params = query.toObject();
// { query: { status: 'active' }, limit: 10 }
```

***

### where()

> **where**(`where`): `this`

Defined in: [QueryBuilder.ts:73](https://github.com/cedricpierre/fluentity-core/blob/1c364020d2341e3801d6ebe12eec8c5b526f53e0/src/QueryBuilder.ts#L73)

Adds where conditions to the query.
Shorthand for filter() that adds exact field-value matches.

#### Parameters

##### where

`Record`\<`string`, `any`\>

Object containing field-value pairs to filter by

#### Returns

`this`

The QueryBuilder instance for chaining

#### Example

```typescript
query.where({ status: 'active', type: 'user' });
```
