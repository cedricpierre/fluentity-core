![npm](https://img.shields.io/npm/v/@fluentity/core)
![CI](https://github.com/cedricpierre/fluentity-core/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/typed-TypeScript-blue.svg)
![tree-shakable](https://img.shields.io/badge/tree--shakable-yes-brightgreen)
![GitHub file size in bytes](https://img.shields.io/github/size/cedricpierre/fluentity-core/dist%2Findex.js)
![Tests](https://img.shields.io/badge/tests-100%25-brightgreen)
![NPM License](https://img.shields.io/npm/l/%40fluentity%2Fcore)






# Fluentity

Fluentity is a lightweight and flexible library for TypeScript/JavaScript applications to consume API using models. It's inspired by Active Record and Laravel Eloquent. It provides a simple and intuitive way to interact with your API endpoints while maintaining type safety and following object-oriented principles. Fluentity has also a small caching mechinism. 

## Quality & Reliability

- 💯 Written in TypeScript
- 🧪 test coverage with Bun:test
- ⚡️ Designed for fast, type-safe API interactions

## Installation

```bash
npm install @fluentity/core
```

Run tests

```bash
npm test
```

### Development

Fluentity Core uses Bun.

```bash
bun install
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
import { Fluentity, RestAdapter, RestAdapterOptions } from '@fluentity/core';

/**
 * Configuration options for initializing Fluentity
 */
interface FluentityConfig {
  /** The adapter to use for making API requests */
  adapter: RestAdapter;
}

/**
 * Initialize Fluentity with the given configuration
 * @param config - The configuration options
 * @returns The Fluentity instance
 */
const fluentity = Fluentity.initialize({
    adapter: new RestAdapter({
        baseUrl: 'https://api.example.com'
    })
});
```

## Adapters

Currently, Fluentity supports only one adapter: RestAdapter. This allows you to make Restful API calls using the models. In the future we are planning to add more adapters like GraphQL.

```typescript
import { RestAdapter } from '@fluentity/core';

const adapter = new RestAdapter({
    baseUrl: 'https://api.example.com',
});
```

## Creating Models

Models are the core of Fluentity. Here's how to create a model:

```typescript
import {
  Model,
  HasMany,
  Relation,
  Attributes,
  Cast,
  HasOne,
  RelationBuilder,
  Methods,
  AdapterResponse,
} from '../../src/index';

import { Company } from './Company';

import { Media } from './Media';
import { Thumbnail } from './Thumbnail';

import { QueryBuilder } from '../../src/QueryBuilder';

interface UserAttributes extends Attributes {
  name: string;
  phone: number;
  email: string;
  created_at?: string;
  updated_at?: string;
  thumbnail?: Thumbnail;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  static resource = 'users';

  declare name: string;
  declare email: string;
  declare phone: number;

  declare created_at?: string;
  declare updated_at?: string;

  @HasMany(() => Media)
  medias!: Relation<Media[]>;

  @HasMany(() => Media, 'medias')
  libraries!: Relation<Media[]>;

  @HasMany(() => Media, 'custom-resource')
  customResource!: Relation<Media[]>;

  @HasOne(() => Media)
  picture!: Relation<Media>;

  @Cast(() => Thumbnail)
  thumbnail!: Thumbnail;

  @Cast(() => Thumbnail)
  thumbnails!: Thumbnail[];

  @Cast(() => Company)
  company!: Company;

  static scopes = {
    active: (query: RelationBuilder<User>) => query.where({ status: 'active' }),
  };

  // Custom reusable method: User.login(username, password)
  static async login(username: string, password: string) {
    const queryBuilder = new QueryBuilder({
      resource: 'login',
      body: {
        username,
        password,
      },
      method: Methods.POST,
    });

    const response = await this.call(queryBuilder);

    return new this(response.data);
  }
}

```

### Using the official CLI tool :

Have a look at this package to generate complete models: [Fluentity CLI](https://github.com/cedricpierre/fluentity-cli)

## Model Methods

### Static Methods

Models come with several static methods for querying and manipulating data:

```typescript
/**
 * Get all records from the API
 * @returns Promise resolving to an array of model instances
 */
Model.all(): Promise<Model[]>

/**
 * Find a record by ID
 * @param id - The ID of the record to find
 * @returns Promise resolving to a model instance
 */
Model.find(id: string | number): Promise<Model>

/**
 * Start a query for a specific ID
 * @param id - The ID to query
 * @returns A query builder instance
 */
Model.id(id: string | number): QueryBuilder

/**
 * Create a new record
 * @param data - The data to create the record with
 * @returns Promise resolving to the created model instance
 */
Model.create(data: Partial<Attributes>): Promise<Model>

/**
 * Update a record
 * @param id - The ID of the record to update
 * @param data - The data to update the record with
 * @returns Promise resolving to the updated model instance
 */
Model.update(id: string | number, data: Partial<Attributes>): Promise<Model>

/**
 * Delete a record
 * @param id - The ID of the record to delete
 * @returns Promise that resolves when the deletion is complete
 */
Model.delete(id: string | number): Promise<void>
```

### Instance Methods

```typescript
/**
 * Save the instance (create or update)
 * @returns Promise resolving to the saved model instance
 */
model.save(): Promise<Model>

/**
 * Update the instance with new data
 * @param data - The data to update the instance with
 * @returns Promise resolving to the updated model instance
 */
model.update(data: Partial<Attributes>): Promise<Model>

/**
 * Delete the instance
 * @returns Promise that resolves when the deletion is complete
 */
model.delete(): Promise<void>
```

### Relation Methods

Example usage:

```typescript
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

## Query builder

The QueryBuilder class is used under the hood the create the queries. It can be used by any Adapter. The query builder can also be instantiated in a Model and make queries using `Model.call(queryBuilder)`.

### Nesting query builer

This is the core of Fluentity, you can nest different query builders and the adapter will manage that. That's how relations are built:

```typescript
    const queryBuilder = new QueryBuilder({
      resource: 'medias',
      id: 2,
      parent: new QueryBuilder({
        resource: 'users',
        id: 1
      })
    });

    Fluentity.adapter.call(queryBuilder); // Will create a Get /users/1/medias/2
```

That's what Models decorators are doing under the hood.


## Decorators

Fluentity provides several decorators to define relationships and type casting:

### Relationship Decorators

```typescript
import { HasOne, HasMany, BelongsTo, BelongsToMany, Relation } from '@fluentity/core';

/**
 * User model with relationship decorators
 * @class User
 * @extends {Model<UserAttributes>}
 */
class User extends Model<UserAttributes> {
  /** One-to-one relationship with Profile model */
  @HasOne(() => Profile)
  profile!: Relation<Profile>;

  /** One-to-many relationship with Post model */
  @HasMany(() => Post)
  posts!: Relation<Post[]>;

  /** One-to-many relationship with Media model using custom resource name */
  @HasMany(() => Media, 'libraries')
  medias!: Relation<Media[]>;

  /** Many-to-many relationship with Role model */
  @BelongsToMany(() => Role)
  roles!: Relation<Role[]>;
}
```

### Type Casting

```typescript
import { Cast } from '@fluentity/core';

/**
 * User model with type casting decorators
 * @class User
 * @extends {Model<UserAttributes>}
 */
class User extends Model<UserAttributes> {
  /** Cast created_at to Date type */
  @Cast(() => Date)
  created_at?: Date;

  /** Cast thumbnail to Thumbnail type */
  @Cast(() => Thumbnail)
  thumbnail?: Thumbnail;

  /** Cast thumbnails array to array of Thumbnail type */
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

## Custom methods

You can also declare custom methods in the models.
The idea is to abstract the query using QueryBuilder, that way it's not dependant of the selected Adapter.

```typescript
class User extends Model<UserAttributes> {
  static async login(username: string, password: string) {

    // The query builder will be used by the current adapter.
    const queryBuilder = new QueryBuilder({
      resource: 'login',
      body: {
        username,
        password,
      },
      method: Methods.POST,
    });

    // Model has a static method "call" that uses the adapter.
    const response = await this.call(queryBuilder);

    // We are are to create a new instance of User
    return new this(response.data);
  }
}
```

Usage:

```typescript
const user = await User.login(username, password);
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

Example usage:

```typescript
// Query with conditions
const activeUsers = await User.where({ status: 'active' }).all();

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
