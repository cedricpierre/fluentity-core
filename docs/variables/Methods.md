[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Methods

# Variable: Methods

> `const` **Methods**: `object`

Defined in: [adapters/HttpAdapter.ts:19](https://github.com/cedricpierre/fluentity-core/blob/3545f27c0a85945d554127b597e9fe870d03f95a/src/adapters/HttpAdapter.ts#L19)

HTTP method constants for use in requests.
Provides type-safe HTTP method names.

## Type declaration

### DELETE

> `readonly` **DELETE**: `"DELETE"` = `'DELETE'`

HTTP DELETE method

### GET

> `readonly` **GET**: `"GET"` = `'GET'`

HTTP GET method

### HEAD

> `readonly` **HEAD**: `"HEAD"` = `'HEAD'`

HTTP HEAD method

### OPTIONS

> `readonly` **OPTIONS**: `"OPTIONS"` = `'OPTIONS'`

HTTP OPTIONS method

### PATCH

> `readonly` **PATCH**: `"PATCH"` = `'PATCH'`

HTTP PATCH method

### POST

> `readonly` **POST**: `"POST"` = `'POST'`

HTTP POST method

### PUT

> `readonly` **PUT**: `"PUT"` = `'PUT'`

HTTP PUT method

## Example

```typescript
const method: MethodType = Methods.POST;
```
