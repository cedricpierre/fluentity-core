[**@fluentity/core**](../README.md)

***

[@fluentity/core](../globals.md) / Methods

# Variable: Methods

> `const` **Methods**: `object`

Defined in: [Fluentity.ts:101](https://github.com/cedricpierre/fluentity-core/blob/1d61f2807beb4f29a63808a89bba251ec2261e92/src/Fluentity.ts#L101)

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
