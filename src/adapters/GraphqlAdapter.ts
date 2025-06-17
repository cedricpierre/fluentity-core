import { QueryBuilder } from '../QueryBuilder';
import { HttpAdapter, HttpAdapterOptions, HttpRequest, HttpResponse, Methods } from './HttpAdapter';

/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
export class GraphqlAdapter extends HttpAdapter {
  declare options: GraphqlAdapterOptions;

  /**
   * Constructor for the GraphqlAdapter class.
   * @param options - Partial configuration options to merge with existing options
   * @throws {Error} If endpoint is not provided
   */
  constructor(options: Partial<GraphqlAdapterOptions>) {
    super(options);

    if (!options.endpoint) {
      throw new Error('GraphqlAdapter requires an endpoint');
    }

    this.options = { ...this.options, ...options } as GraphqlAdapterOptions;
  }

  protected buildRequest(queryBuilder: QueryBuilder): HttpRequest {


    return new HttpRequest({
      url: this.options.endpoint ?? '/graphql',
      method: queryBuilder.method ?? Methods.POST,
      body: this.buildBody(queryBuilder),
      options: this.options?.options,
    });
  }

  private buildBody(queryBuilder: QueryBuilder) {
    return {
      query: this.buildGraphQLQuery(queryBuilder),
      variables: this.buildVariables(queryBuilder),
      operationName: this.generateOperationName(queryBuilder),
    };
  }

  private determineOperation(queryBuilder: QueryBuilder): 'query' | 'mutation' {
    switch (queryBuilder.method) {
      case 'GET':
        return 'query';
      case 'POST':
      case 'PUT':
      case 'PATCH':
        return 'mutation';
      case 'DELETE':
        return 'mutation';
      default:
        return 'query';
    }
  }

  private buildGraphQLQuery(queryBuilder: QueryBuilder): string {
    const operation = this.determineOperation(queryBuilder);
    const resource = queryBuilder.model?.resource ?? 'resource';
    const fields = this.buildFields(queryBuilder);
    const arguments_ = this.buildArguments(queryBuilder);
    
    let query = `${operation} ${this.generateOperationName(queryBuilder)}`;
    
    if (arguments_.length > 0) {
      query += `(${arguments_.join(', ')})`;
    }
    
    query += ` {\n  ${resource}${this.buildQueryArguments(queryBuilder)} {\n    ${fields}\n  }\n}`;
    
    return query;
  }

  private buildFields(queryBuilder: QueryBuilder): string {
    const fields = new Set<string>();
    
    // Add basic fields if no specific fields are requested
    fields.add('id');
    
    // Add fields from query parameters that might represent field selections
    if (queryBuilder.query) {
      Object.keys(queryBuilder.query).forEach(key => {
        if (typeof queryBuilder.query![key] === 'boolean' && queryBuilder.query![key]) {
          fields.add(key);
        }
      });
    }
    
    // Add fields from body if it contains field selections
    if (queryBuilder.body && typeof queryBuilder.body === 'object') {
      Object.keys(queryBuilder.body).forEach(key => {
        if (typeof queryBuilder.body![key] === 'boolean' && queryBuilder.body![key]) {
          fields.add(key);
        }
      });
    }
    
    // Handle recursive relations
    if (queryBuilder.parent) {
      const parentFields = this.buildFields(queryBuilder.parent);
      fields.add(parentFields);
    }
    
    return Array.from(fields).join('\n    ');
  }

  private buildArguments(queryBuilder: QueryBuilder): string[] {
    const args: string[] = [];
    
    // Add ID argument for single resource operations
    if (queryBuilder.id) {
      args.push('$id: ID!');
    }
    
    // Add pagination arguments
    if (queryBuilder.limit) {
      args.push('$limit: Int');
    }
    if (queryBuilder.offset) {
      args.push('$offset: Int');
    }
    if (queryBuilder.page) {
      args.push('$page: Int');
    }
    if (queryBuilder.perPage) {
      args.push('$perPage: Int');
    }
    
    // Add sorting arguments
    if (queryBuilder.sort) {
      args.push('$sort: String');
    }
    if (queryBuilder.direction) {
      args.push('$direction: String');
    }
    
    // Add filter arguments
    if (queryBuilder.query && Object.keys(queryBuilder.query).length > 0) {
      args.push('$filters: JSON');
    }
    
    // Add input arguments for mutations
    if (queryBuilder.body && this.determineOperation(queryBuilder) === 'mutation') {
      args.push('$input: JSON!');
    }
    
    return args;
  }

  private buildQueryArguments(queryBuilder: QueryBuilder): string {
    const args: string[] = [];
    
    // Add ID argument
    if (queryBuilder.id) {
      args.push('id: $id');
    }
    
    // Add pagination arguments
    if (queryBuilder.limit) {
      args.push('limit: $limit');
    }
    if (queryBuilder.offset) {
      args.push('offset: $offset');
    }
    if (queryBuilder.page) {
      args.push('page: $page');
    }
    if (queryBuilder.perPage) {
      args.push('perPage: $perPage');
    }
    
    // Add sorting arguments
    if (queryBuilder.sort) {
      args.push('sort: $sort');
    }
    if (queryBuilder.direction) {
      args.push('direction: $direction');
    }
    
    // Add filter arguments
    if (queryBuilder.query && Object.keys(queryBuilder.query).length > 0) {
      args.push('filters: $filters');
    }
    
    // Add input arguments for mutations
    if (queryBuilder.body && this.determineOperation(queryBuilder) === 'mutation') {
      args.push('input: $input');
    }
    
    return args.length > 0 ? `(${args.join(', ')})` : '';
  }

  private buildVariables(queryBuilder: QueryBuilder): Record<string, any> {
    const variables: Record<string, any> = {};
    
    // Add ID variable
    if (queryBuilder.id) {
      variables.id = queryBuilder.id;
    }
    
    // Add pagination variables
    if (queryBuilder.limit) {
      variables.limit = queryBuilder.limit;
    }
    if (queryBuilder.offset) {
      variables.offset = queryBuilder.offset;
    }
    if (queryBuilder.page) {
      variables.page = queryBuilder.page;
    }
    if (queryBuilder.perPage) {
      variables.perPage = queryBuilder.perPage;
    }
    
    // Add sorting variables
    if (queryBuilder.sort) {
      variables.sort = queryBuilder.sort;
    }
    if (queryBuilder.direction) {
      variables.direction = queryBuilder.direction;
    }
    
    // Add filter variables
    if (queryBuilder.query && Object.keys(queryBuilder.query).length > 0) {
      variables.filters = queryBuilder.query;
    }
    
    // Add input variables for mutations
    if (queryBuilder.body && this.determineOperation(queryBuilder) === 'mutation') {
      variables.input = queryBuilder.body;
    }
    
    return variables;
  }

  private generateOperationName(queryBuilder: QueryBuilder): string {
    const resource = queryBuilder.model?.resource || 'resource';
    const method = queryBuilder.method || 'GET';
    
    if (queryBuilder.id) {
      return `Get${resource.charAt(0).toUpperCase() + resource.slice(1)}ById`;
    }
    
    switch (method) {
      case 'GET':
        return `Get${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
      case 'POST':
        return `Create${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
      case 'PUT':
      case 'PATCH':
        return `Update${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
      case 'DELETE':
        return `Delete${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
      default:
        return `Get${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
    }
  }

}

/**
 * Configuration options for the HttpClient.
 */
export type GraphqlAdapterOptions = {
  endpoint?: string;
} & HttpAdapterOptions;
