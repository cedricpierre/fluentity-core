// src/adapters/DefaultAdapter.ts
class DefaultAdapter {
  options = {};
  async call(_queryBuilder) {
    return Promise.resolve({ data: undefined });
  }
  configure(_options) {}
}

// src/Fluentity.ts
var Methods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS"
};

class Fluentity {
  static instance;
  #adapter;
  #options;
  constructor(options) {
    if (Fluentity.instance) {
      throw new Error("Fluentity instance already exists. Use getInstance() instead.");
    }
    this.#options = options;
    this.#adapter = options?.adapter ?? new DefaultAdapter;
    Fluentity.instance = this;
  }
  configure(options) {
    if (!Fluentity.instance) {
      throw new Error("Fluentity has not been initialized. Call initialize() first.");
    }
    this.#options = options;
    this.#adapter = options?.adapter ?? new DefaultAdapter;
  }
  get adapter() {
    return this.#adapter;
  }
  static initialize(options) {
    if (Fluentity.instance) {
      throw new Error("Fluentity has already been initialized. Use getInstance() instead.");
    }
    return new Fluentity(options);
  }
  static reset() {
    console.log("resetting fluentity");
    Fluentity.instance = undefined;
  }
  static getInstance() {
    if (!Fluentity.instance) {
      throw new Error("Fluentity has not been initialized. Call initialize() first.");
    }
    return Fluentity.instance;
  }
  call(queryBuilder) {
    return this.#adapter.call(queryBuilder);
  }
  static call(queryBuilder) {
    return Fluentity.getInstance().call(queryBuilder);
  }
}

// src/QueryBuilder.ts
class QueryBuilder {
  constructor(options) {
    if (options) {
      Object.assign(this, options);
    }
  }
  resource;
  id;
  parent;
  query = {};
  sort;
  direction;
  limit;
  offset;
  page;
  perPage;
  method;
  body;
  where(where) {
    this.filter(where);
    return this;
  }
  filter(filters) {
    this.query = { ...this.query, ...filters };
    return this;
  }
  reset() {
    this.query = {};
    this.sort = undefined;
    this.direction = undefined;
    this.limit = undefined;
    this.offset = undefined;
    this.page = undefined;
    this.perPage = undefined;
    this.id = undefined;
    this.method = undefined;
    return this;
  }
  toObject() {
    return Object.entries({
      query: this.query,
      method: this.method,
      sort: this.sort,
      direction: this.direction,
      limit: this.limit,
      offset: this.offset,
      page: this.page,
      perPage: this.perPage
    }).filter(([_, value]) => value !== undefined).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }
}

// src/RelationBuilder.ts
class RelationBuilder {
  queryBuilder;
  relatedModel;
  constructor(model, queryBuilder, resource) {
    this.relatedModel = model;
    this.queryBuilder = new QueryBuilder({
      resource: resource ?? this.relatedModel.resource
    });
    if (queryBuilder?.resource) {
      this.queryBuilder.parent = { ...queryBuilder };
    }
    if (this.relatedModel.scopes) {
      Object.entries(this.relatedModel.scopes).forEach(([name, scope]) => {
        this[name] = (...args) => {
          return scope(this, ...args);
        };
      });
    }
  }
  get fluentity() {
    return Fluentity.getInstance();
  }
  id(id) {
    return new this.relatedModel({ id }, this.queryBuilder);
  }
  async find(id) {
    this.queryBuilder.id = id;
    this.queryBuilder.method = Methods.GET;
    const response = await this.fluentity.adapter.call(this.queryBuilder);
    const model = new this.relatedModel(response.data, this.queryBuilder);
    model.queryBuilder.id = id;
    return model;
  }
  where(where) {
    this.queryBuilder.where(where);
    return this;
  }
  filter(filters) {
    this.queryBuilder.filter(filters);
    return this;
  }
  orderBy(sort = "id", direction = "asc") {
    this.queryBuilder.sort = sort;
    this.queryBuilder.direction = direction;
    return this;
  }
  limit(n) {
    this.queryBuilder.limit = n;
    return this;
  }
  offset(n) {
    this.queryBuilder.offset = n;
    return this;
  }
}

// src/HasOneRelationBuilder.ts
class HasOneRelationBuilder extends RelationBuilder {
  async get() {
    this.queryBuilder.method = Methods.GET;
    this.queryBuilder.id = this.relatedModel.id;
    const response = await this.fluentity.adapter.call(this.queryBuilder);
    return new this.relatedModel(response.data, { ...this.queryBuilder });
  }
  async update(data, method = Methods.PUT) {
    this.queryBuilder.method = method;
    this.queryBuilder.id = this.relatedModel.id;
    const response = await this.fluentity.adapter.call(this.queryBuilder);
    return new this.relatedModel(response.data, { ...this.queryBuilder });
  }
  async delete() {
    this.queryBuilder.method = Methods.DELETE;
    this.queryBuilder.id = this.relatedModel.id;
    await this.fluentity.adapter.call(this.queryBuilder);
  }
}

// src/HasManyRelationBuilder.ts
class HasManyRelationBuilder extends RelationBuilder {
  async all() {
    this.queryBuilder.method = Methods.GET;
    this.queryBuilder.id = undefined;
    const list = await this.fluentity.adapter.call(this.queryBuilder);
    return list?.data?.map((i) => new this.relatedModel(i, { ...this.queryBuilder }));
  }
  async create(data) {
    this.queryBuilder.method = Methods.POST;
    this.queryBuilder.body = data;
    this.queryBuilder.id = undefined;
    const response = await this.fluentity.adapter.call(this.queryBuilder);
    return new this.relatedModel(response.data, { ...this.queryBuilder });
  }
  async delete(id) {
    this.queryBuilder.method = Methods.DELETE;
    this.queryBuilder.id = id;
    await this.fluentity.adapter.call(this.queryBuilder);
  }
  async update(id, data, method = Methods.PUT) {
    this.queryBuilder.method = method;
    this.queryBuilder.id = id;
    this.queryBuilder.body = data;
    const response = await this.fluentity.adapter.call(this.queryBuilder);
    return new this.relatedModel(response.data, { ...this.queryBuilder });
  }
  async paginate(page = 1, perPage = 10) {
    this.queryBuilder.page = page;
    this.queryBuilder.perPage = perPage;
    this.queryBuilder.offset = (page - 1) * perPage;
    this.queryBuilder.limit = perPage;
    const list = await this.fluentity.adapter.call(this.queryBuilder);
    return list?.data?.map((i) => new this.relatedModel(i, { ...this.queryBuilder }));
  }
}

// src/Model.ts
class Model {
  static scopes;
  id;
  #queryBuilder;
  static resource;
  constructor(attributes, queryBuilder) {
    if (attributes) {
      Object.assign(this, attributes);
    }
    this.#queryBuilder = queryBuilder ?? new QueryBuilder;
    this.#queryBuilder.resource = this.constructor.resource;
    this.#queryBuilder.id = this.id;
    return this;
  }
  get queryBuilder() {
    return this.#queryBuilder;
  }
  get fluentity() {
    return Fluentity.getInstance();
  }
  static getRelationBuilder(model, relationBuilderFactory) {
    const queryBuilder = new QueryBuilder;
    return new relationBuilderFactory(model, queryBuilder, model.constructor.resource);
  }
  static id(id) {
    return new this({ id });
  }
  static query() {
    return Model.getRelationBuilder(this, HasManyRelationBuilder);
  }
  static where(where) {
    return Model.getRelationBuilder(this, HasManyRelationBuilder).where(where);
  }
  static filter(filters) {
    return Model.getRelationBuilder(this, HasManyRelationBuilder).filter(filters);
  }
  static async all() {
    return await Model.getRelationBuilder(this, HasManyRelationBuilder).all();
  }
  static async find(id) {
    return await Model.getRelationBuilder(this, HasOneRelationBuilder).find(id);
  }
  static async create(data) {
    return await Model.getRelationBuilder(this, HasManyRelationBuilder).create(data);
  }
  static async update(id, data, method = Methods.PUT) {
    return await Model.getRelationBuilder(this, HasManyRelationBuilder).update(id, data, method);
  }
  static async delete(id) {
    return Model.getRelationBuilder(this, HasManyRelationBuilder).delete(id);
  }
  async get() {
    this.#queryBuilder.method = Methods.GET;
    const data = await this.fluentity.adapter.call(this.#queryBuilder);
    Object.assign(this, data.data);
    return this;
  }
  async save() {
    if (this.id) {
      return this.update();
    }
    this.#queryBuilder.method = Methods.POST;
    this.#queryBuilder.body = this.toObject();
    const data = await this.fluentity.adapter.call(this.#queryBuilder);
    Object.assign(this, data.data);
    return this;
  }
  async update(attributes, method = Methods.PUT) {
    if (attributes)
      Object.assign(this, attributes);
    this.#queryBuilder.method = method;
    this.#queryBuilder.body = this.toObject();
    const updated = await this.fluentity.adapter.call(this.#queryBuilder);
    Object.assign(this, updated.data);
    return this;
  }
  async delete() {
    this.#queryBuilder.method = Methods.DELETE;
    await this.fluentity.adapter.call(this.#queryBuilder);
  }
  async call(queryBuilder) {
    return this.constructor.call(queryBuilder);
  }
  static async call(queryBuilder) {
    return await Fluentity.getInstance().adapter.call(queryBuilder);
  }
  toObject() {
    const obj = {};
    Object.keys(this).forEach((key) => {
      obj[key] = this[key];
    });
    const descriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this));
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (descriptor.get) {
        const value = this[key];
        if (value instanceof Model) {
          obj[key] = value.toObject();
        } else if (Array.isArray(value) && value.length > 0) {
          obj[key] = value.filter((item) => item instanceof Model && typeof item.toObject === "function").map((item) => item.toObject());
        }
      }
    }
    return obj;
  }
}
// src/decorators.ts
var makeRelation = (model, relationBuilderFactory, resource) => {
  return function(target, key) {
    Object.defineProperty(target, key, {
      get() {
        return new relationBuilderFactory(model(), this.queryBuilder, resource);
      },
      enumerable: true,
      configurable: true
    });
  };
};
var Cast = (caster) => {
  return function(target, key) {
    const privateKey = Symbol(String(key));
    Object.defineProperty(target, key, {
      get() {
        if (!this[privateKey]) {
          this[privateKey] = undefined;
        }
        const value = this[privateKey];
        if (!value)
          return value;
        const ModelClass = caster();
        if (!ModelClass)
          return value;
        if (Array.isArray(value)) {
          return value.map((item) => item instanceof ModelClass ? item : new ModelClass(item));
        } else if (value instanceof ModelClass) {
          return value;
        } else {
          return new ModelClass(value);
        }
      },
      set(value) {
        const ModelClass = caster();
        if (!ModelClass) {
          this[privateKey] = value;
          return;
        }
        if (Array.isArray(value)) {
          this[privateKey] = value.map((item) => item instanceof ModelClass ? item : new ModelClass(item));
        } else if (value instanceof ModelClass) {
          this[privateKey] = value;
        } else {
          this[privateKey] = new ModelClass(value);
        }
      },
      enumerable: true,
      configurable: true
    });
  };
};
var HasOne = (model, resource) => {
  return makeRelation(model, HasOneRelationBuilder, resource);
};
var HasMany = (model, resource) => {
  return makeRelation(model, HasManyRelationBuilder, resource);
};
var BelongsTo = HasOne;
var BelongsToMany = HasMany;
// src/adapters/HttpAdapter.ts
class HttpAdapter {
  _cache = new WeakMap;
  _url = "";
  options = {
    baseUrl: "",
    options: {
      headers: {
        "Content-Type": "application/json"
      }
    },
    requestInterceptor: undefined,
    responseInterceptor: undefined,
    errorInterceptor: undefined,
    requestHandler: this.fetchRequestHandler,
    cacheOptions: {
      enabled: false,
      ttl: 5 * 60 * 1000
    }
  };
  constructor(options) {
    this.options = { ...this.options, ...options };
  }
  configure(options) {
    this.options = { ...this.options, ...options };
    return this;
  }
  get url() {
    return this._url;
  }
  clearCache() {
    this._cache = new WeakMap;
    return this;
  }
  async call(queryBuilder) {
    try {
      if (!this.options.baseUrl) {
        throw new Error("baseUrl is required");
      }
      const request = new HttpRequest({
        url: this.buildUrl(queryBuilder),
        method: queryBuilder.method,
        body: queryBuilder.body,
        options: this.options?.options
      });
      if (this.options.cacheOptions?.enabled) {
        const cachedData = this._cache.get(request);
        if (cachedData) {
          const now = Date.now();
          if (now - cachedData.timestamp < (this.options.cacheOptions.ttl || 0)) {
            return cachedData;
          }
          this._cache.delete(request);
        }
      }
      if (this.options.requestInterceptor) {
        Object.assign(request, this.options.requestInterceptor.call(this, request));
      }
      let response = await this.options.requestHandler.call(this, request);
      if (this.options.responseInterceptor) {
        response = this.options.responseInterceptor.call(this, response);
      }
      if (this.options.cacheOptions?.enabled) {
        this._cache.set(request, {
          data: response,
          timestamp: Date.now()
        });
      }
      return response;
    } catch (error) {
      if (this.options.errorInterceptor && error instanceof Error) {
        this.options.errorInterceptor(error);
      }
      throw error;
    }
  }
  buildUrl(_queryBuilder) {
    return "";
  }
  async fetchRequestHandler(_request) {
    return Promise.resolve(new HttpResponse);
  }
}

class HttpRequest {
  url = "";
  options;
  method;
  body;
  constructor(options) {
    if (options) {
      Object.assign(this, options);
    }
  }
}

class HttpResponse {
  data = {};
  constructor(options) {
    if (options) {
      Object.assign(this, options);
    }
  }
}

// src/adapters/RestAdapter.ts
class RestAdapter extends HttpAdapter {
  constructor(options) {
    super(options);
    this.options = { ...this.options, ...options };
  }
  buildUrl(queryBuilder) {
    const queryString = this.toQueryString(queryBuilder);
    let segments = [];
    segments = this.unwrapParents(queryBuilder, segments);
    let url = segments.join("/");
    if (queryString) {
      url += `?${queryString}`;
    }
    this._url = url;
    return decodeURIComponent(this._url);
  }
  unwrapParents(queryBuilder, segments) {
    if (queryBuilder.parent) {
      this.unwrapParents(queryBuilder.parent, segments);
    }
    if (queryBuilder.resource && queryBuilder.id) {
      segments.push(`${queryBuilder.resource}/${queryBuilder.id}`);
    } else if (queryBuilder.resource) {
      segments.push(`${queryBuilder.resource}`);
    }
    return segments;
  }
  toQueryString(queryBuilder) {
    const obj = { ...queryBuilder.query };
    obj.page = queryBuilder.page;
    obj.perPage = queryBuilder.perPage;
    obj.sort = queryBuilder.sort;
    obj.direction = queryBuilder.direction;
    obj.limit = queryBuilder.limit;
    obj.offset = queryBuilder.offset;
    return Object.entries(obj).filter(([_key, value]) => value !== undefined).map(([key, value]) => `${key}=${value}`).join("&");
  }
  async fetchRequestHandler(request) {
    if (request.options?.headers?.["Content-Type"] === "application/json" && request.body) {
      request.body = JSON.stringify(request.body);
    }
    try {
      const response = await fetch(`${this.options.baseUrl}/${request.url}`, {
        method: request.method,
        body: ["PUT", "POST", "PATCH"].includes(request.method) ? request.body : null,
        headers: request.options?.headers,
        credentials: request.options?.credentials,
        mode: request.options?.mode,
        redirect: request.options?.redirect,
        referrer: request.options?.referrer,
        cache: request.options?.cache,
        keepalive: request.options?.keepalive,
        signal: request.options?.signal
      });
      return new HttpResponse({
        data: await response.json()
      });
    } catch (error) {
      throw new Error(`HTTP error: ${error}`);
    }
  }
}
export {
  RestAdapter,
  RelationBuilder,
  Model,
  Methods,
  HasOne,
  HasMany,
  Fluentity,
  DefaultAdapter,
  Cast,
  BelongsToMany,
  BelongsTo
};
