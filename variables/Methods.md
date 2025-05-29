[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Methods

# Variable: Methods

> `const` **Methods**: `object`

Defined in: [Fluentity.ts:101](https://github.com/cedricpierre/fluentity-core/blob/c66aa7b53f67991fe1e6a5b8d69453cb8e881a43/src/Fluentity.ts#L101)

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
