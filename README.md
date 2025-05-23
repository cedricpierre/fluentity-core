![Coverage](https://codecov.io/gh/cedricpierre/fluentity-core/core/branch/main/graph/badge.svg)
![npm](https://img.shields.io/npm/v/@fluentity/core)
![CI](https://github.com/cedricpierre/fluentity-core/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/typed-TypeScript-blue.svg)
![tree-shakable](https://img.shields.io/badge/tree--shakable-yes-brightgreen)
![Tests](https://img.shields.io/badge/tests-100%25-brightgreen)




# Fluentity

Fluentity is a lightweight and flexible library for TypeScript/JavaScript applications to consume RESTFul API using models. It's inspired by Active Record and Laravel Eloquent. It provides a simple and intuitive way to interact with your API endpoints while maintaining type safety and following object-oriented principles. Fluentity has also a small caching mechinism.

## Quality & Reliability

- 💯 Written in TypeScript
- 🧪 99% test coverage with Vitest
- ⚡️ Designed for fast, type-safe API interactions

## Installation

```bash
npm install @fluentity/core
```

Run tests

```bash
npm test
```

## Configuration

In JavaScript, property decorators are not natively supported yet (as of 2025), but they can be enabled using transpilers like Babel or TypeScript with experimental support.

Here's how to enable and use them in TypeScript, which has the best support for decorators:

### Typescript

In your `tsconfig.json`

```typescript
{
  "compilerOptions": {
    "target": "ESNext",
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

### If you are using Babel

```json
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "version": "legacy" }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
}
```

After you need to initialize Fluentity with an adapter:

```typescript
import { Fluentity, RestAdapter } from '@fluentity/core';

const fluentity = Fluentity.initialize({
    adapter: new RestAdapter({
        baseUrl: 'https://api.example.com',
        // Optional configuration
        cacheOptions: {
            enabled: true,
            ttl: 1000 // Time to live in milliseconds
        },
        responseInterceptor: (response) => {
            // Modify response before returning
            return response;
        }
    })
});
```

## Creating Models

Models are the core of Fluentity. Here's how to create a model:

```typescript
import { Model, Attributes } from '@fluentity/core';

interface UserAttributes extends Attributes {
  name: string;
  email: string;
  phone?: number;
  company?: Company;
}

export class User extends Model<UserAttributes> {
  static resource = 'users'; // The API endpoint for this model
}
```

## Model Methods

### Static Methods

Models come with several static methods for querying and manipulating data:

- `Model.all()`: Get all records
- `Model.find(id)`: Find a record by ID
- `Model.id(id)`: Start a query for a specific ID
- `Model.create(data)`: Create a new record
- `Model.update(id, data)`: Update a record
- `Model.delete(id)`: Delete a record

### Instance Methods

- `model.save()`: Save the instance (create or update)
- `model.update(data)`: Update the instance with data
- `model.delete()`: Delete the instance

### Relation Methods

- `model.relation.all()`: Get all related records
- `model.relation.create(data)`: Create a new related record
- `model.relation.update(id, data)`: Update a related record
- `model.relation.delete(id)`: Delete a related record
- `model.relation.limit(n)`: Limit the number of records
- `model.relation.offset(n)`: Skip n records

Example usage:

```typescript
// Get all users
const users = await User.all();

// Find user by ID
const user = await User.find(1);

// Get user by ID using query builder
const user = await User.id(1).get();

// Create new user
const user = new User({ 
    name: 'John Doe', 
    email: 'john@example.com',
    phone: 1234567890 
});
await user.save();

// Or create directly
const user = await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    phone: 1234567890
});

// Update user
await User.update(1, { name: 'Jane Doe' });

// Delete user
await User.delete(1);

// Working with relations
const post = await Post.find(1);
const comments = await post.comments.all();
const comment = await post.comments.create({ 
    name: 'John', 
    email: 'john@example.com' 
});

// Using pagination
const comments = await post.comments.limit(10).offset(10).all();
```

## Caching

Fluentity provides a simple caching mechanism that can be configured through the adapter:

```typescript
const fluentity = Fluentity.initialize({
    adapter: new RestAdapter({
        baseUrl: 'https://api.example.com',
        cacheOptions: {
            enabled: true,
            ttl: 1000 // Time to live in milliseconds
        }
    })
});

// Clear cache for a specific endpoint
fluentity.adapter.deleteCache("users/1");

// Get cache for a specific endpoint
const cache = fluentity.adapter.getCache("users/1");
```

## Decorators

Fluentity provides several decorators to define relationships and type casting:

### Relationship Decorators

```typescript
import { HasOne, HasMany, BelongsTo, BelongsToMany } from '@fluentity/core';

class User extends Model<UserAttributes> {
  @HasOne(() => Profile)
  profile!: Relation<Profile>;

  @HasMany(() => Post)
  posts!: Relation<Post[]>;

  // use a custom resource named "libraries"
  @HasMany(() => Media, 'libraries')
  medias!: Relation<Media[]>;

  @BelongsToMany(() => Role)
  roles!: Relation<Role[]>;
}
```

### Type Casting

```typescript
import { Cast } from '@fluentity/core';

class User extends Model<UserAttributes> {
  @Cast(() => Date)
  created_at?: Date;

  @Cast(() => Thumbnail)
  thumbnail?: Thumbnail;

  @Cast(() => Thumbnail)
  thumbnails?: Thumbnail[];
}
```

## Scopes

Scopes allow you to define reusable query constraints:

```typescript
class User extends Model<UserAttributes> {
  static scopes = {
    active: (query) => query.where({ status: 'active' })
  };
}
```

## Static Methods

Models come with several static methods for querying and manipulating data:

- `Model.all()`: Get all records
- `Model.find(id)`: Find a record by ID
- `Model.create(data)`: Create a new record
- `Model.update(id, data)`: Update a record
- `Model.delete(id)`: Delete a record

## Instance methods

- `model.get()`: Fetch the instance using the id, if defined
- `model.id(id)`: Return a new instance with id.
- `model.update(data)`: Update the instance with data
- `model.delete()`: Delete the instance
- `model.save()`: Save the instance

## Relation methods

- `query()`: Start a new query builder
- `where(conditions)`: Add where conditions
- `filter(filters)`: Add filter conditions
- `include(relations)`: Add include query string

Example usage:

```typescript
// Get all users
const users = await User.all();

// Find user by ID
const user = await User.find(1);

// Create new user
const newUser = await User.create({
  name: 'John Doe',
  email: 'john@example.com'
});

// Update user
await User.update(1, { name: 'Jane Doe' });

// Delete user
await User.delete(1);

// Query with conditions
const activeUsers = await User.where({ status: 'active' }).all();

// Include related models
const userWithPosts = await User.include('posts').find(1);

// Deep chaining
const thumbails = User.id(1).medias.id(2).thumnails.all();
// Will make a call to /users/1/medias/2/thumbails
```

## Instance Methods

Model instances have the following methods:

- `save()`: Create or update the record
- `update(data)`: Update the record
- `delete()`: Delete the record

Example usage:

```typescript
const user = new User({
  name: 'John Doe',
  email: 'john@example.com'
});

// Save new user
await user.save();

// Update user
user.name = 'Jane Doe';
await user.update({ email: "test@example.com" });

// Delete user
await user.delete();
```

## Using relations

You can use the relations declared in the model to create API calls.

```typescript
const user = User.find(1)

// Will create an API call: GET /users/1/medias
user.medias.all()

// Will create an API call: GET /users/1/medias/2
user.medias.find(2)

// Will create an API call: GET /users/1/medias/2/thumbnails
user.medias.id(2).thumbnails.all()
```

### Difference between id() and find()

```typescript
const user = User.find(1) // Will make an API call to /users/1

const user = User.id(1) // return an instance of a new User with id equals 1. Then this instance can be used to query relations.

user.medias.all() // Will create an API call: GET /users/1/medias
```

## Additional Methods

### toObject()

The `toObject()` method converts a model instance and its related models into a plain JavaScript object:

```typescript
const user = await User.find(1);
const userObject = user.toObject();
// Returns a plain object with all properties and nested related models
```

## Cache

There is a built-in cache mechanism. This is disabled by default.

```typescript
Fluentity.configure({
    cacheOptions: {
        enabled: true,
        ttl: 5 * 60 * 1000 // 5 minutes in milliseconds
    }
})
```

Every request is put into a cache using the resource as a key :

```typescript
const user = User.find(1)
// if you fetch the same user later, it will come from the cache.
```

Manually accessing the cache

```typescript
// you can access the cache like this :
const cachedResponse = Fluentity.getCache('users/1')

const user = new User(cachedResponse.data)
```

## Error Handling

Fluentity includes comprehensive error handling for common scenarios:

- Missing required parameters (ID, data, where conditions)
- Undefined resource names
- API request failures
- Invalid model operations

Example error handling:

```typescript
try {
  const user = await User.find(1);
} catch (error) {
  if (error instanceof Error) {
    console.error(`Failed to find user: ${error.message}`);
  }
}

try {
  await User.update(1, { name: 'John' });
} catch (error) {
  if (error instanceof Error) {
    console.error(`Failed to update user: ${error.message}`);
  }
}
```

## License

MIT
