[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / QueryBuilder

# Class: QueryBuilder

Defined in: [QueryBuilder.ts:49](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L49)

Builder class for constructing URL query strings and API requests.
Provides a fluent interface for building and managing query parameters for API requests.
Used internally by models and relation builders to construct API calls.

The QueryBuilder supports:
- Resource path construction
- Query parameter management
- Sorting and pagination
- HTTP method specification
- Request body handling

## Example

```typescript
// Basic query with filters and pagination
const query = new QueryBuilder()
  .where({ status: 'active' })
  .orderBy('created_at', 'desc')
  .limit(10)
  .offset(20);

// Complex query with multiple conditions
const query = new QueryBuilder()
  .filter({
    age: { gt: 18, lt: 65 },
    status: ['active', 'pending']
  })
  .orderBy('name', 'asc')
  .page(2, 25);
```

## Constructors

### Constructor

> **new QueryBuilder**(`options?`): `QueryBuilder`

Defined in: [QueryBuilder.ts:50](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L50)

#### Parameters

##### options?

`QueryBuilderOptions`

#### Returns

`QueryBuilder`

## Properties

### body?

> `optional` **body**: `any`

Defined in: [QueryBuilder.ts:78](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L78)

Request body data

***

### direction?

> `optional` **direction**: `string`

Defined in: [QueryBuilder.ts:66](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L66)

Sort direction ('asc' or 'desc')

***

### id?

> `optional` **id**: `string` \| `number`

Defined in: [QueryBuilder.ts:58](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L58)

Resource ID for single-resource operations

***

### limit?

> `optional` **limit**: `number`

Defined in: [QueryBuilder.ts:68](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L68)

Maximum number of results to return

***

### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"` \| `"HEAD"` \| `"OPTIONS"`

Defined in: [QueryBuilder.ts:76](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L76)

HTTP method to use for the request

***

### offset?

> `optional` **offset**: `number`

Defined in: [QueryBuilder.ts:70](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L70)

Number of results to skip

***

### page?

> `optional` **page**: `number`

Defined in: [QueryBuilder.ts:72](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L72)

Page number for pagination

***

### parent?

> `optional` **parent**: `QueryBuilder`

Defined in: [QueryBuilder.ts:60](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L60)

The parents of the query builder

***

### perPage?

> `optional` **perPage**: `number`

Defined in: [QueryBuilder.ts:74](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L74)

Number of items per page

***

### query?

> `optional` **query**: `Record`\<`string`, `any`\> = `{}`

Defined in: [QueryBuilder.ts:62](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L62)

Query parameters to be added to the URL

***

### resource?

> `optional` **resource**: `string`

Defined in: [QueryBuilder.ts:56](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L56)

The resource name for the API endpoint

***

### sort?

> `optional` **sort**: `string`

Defined in: [QueryBuilder.ts:64](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L64)

Field to sort results by

## Methods

### filter()

> **filter**(`filters`): `this`

Defined in: [QueryBuilder.ts:132](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L132)

Adds filter conditions to the query.
Supports more complex filtering operations than where().
Can handle comparison operators, arrays, and nested conditions.

#### Parameters

##### filters

`Record`\<`string`, `any`\>

Object containing filter conditions

#### Returns

`this`

The QueryBuilder instance for method chaining

#### Example

```typescript
// Comparison operators
query.filter({
  age: { gt: 18, lt: 65 },
  price: { gte: 10, lte: 100 }
});

// Array conditions
query.filter({
  status: ['active', 'pending'],
  tags: { in: ['featured', 'popular'] }
});

// Nested conditions
query.filter({
  user: {
    profile: { verified: true },
    role: 'admin'
  }
});
```

***

### reset()

> **reset**(): `this`

Defined in: [QueryBuilder.ts:157](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L157)

Resets the query builder to its initial state.
Clears all query parameters, pagination settings, and request options.
Useful for reusing a query builder instance with different parameters.

#### Returns

`this`

The QueryBuilder instance for method chaining

#### Example

```typescript
// Reset after a complex query
query.where({ status: 'active' })
     .orderBy('created_at', 'desc')
     .limit(10)
     .reset();

// Reuse for a new query
query.where({ type: 'user' })
     .orderBy('name', 'asc');
```

***

### toObject()

> **toObject**(): `Record`\<`string`, `any`\>

Defined in: [QueryBuilder.ts:189](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L189)

Converts the query builder to a plain object.
Used internally to construct the final query parameters for API requests.
Only includes non-undefined values in the output.

#### Returns

`Record`\<`string`, `any`\>

A plain object containing all non-undefined query parameters

#### Example

```typescript
const query = new QueryBuilder()
  .where({ status: 'active' })
  .limit(10);

const params = query.toObject();
// {
//   query: { status: 'active' },
//   limit: 10
// }
```

***

### where()

> **where**(`where`): `this`

Defined in: [QueryBuilder.ts:97](https://github.com/cedricpierre/fluentity-core/blob/f03e6d81aa584b7fed2e0d9eb421f1c6a62ff8f1/src/QueryBuilder.ts#L97)

Adds where conditions to the query.
Shorthand for filter() that adds exact field-value matches.
Multiple calls to where() will merge the conditions.

#### Parameters

##### where

`Record`\<`string`, `any`\>

Object containing field-value pairs to filter by

#### Returns

`this`

The QueryBuilder instance for method chaining

#### Example

```typescript
// Simple equality conditions
query.where({ status: 'active', type: 'user' });

// Multiple where calls are merged
query.where({ status: 'active' })
     .where({ type: 'user' });
```
