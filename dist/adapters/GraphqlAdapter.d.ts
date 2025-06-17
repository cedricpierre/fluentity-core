import { QueryBuilder } from '../QueryBuilder';
import { HttpAdapter, HttpAdapterOptions, HttpRequest } from './HttpAdapter';
/**
 * A static HTTP client class that provides methods for making HTTP requests with built-in caching,
 * interceptors, and request/response handling capabilities.
 */
export declare class GraphqlAdapter extends HttpAdapter {
    options: GraphqlAdapterOptions;
    /**
     * Constructor for the GraphqlAdapter class.
     * @param options - Partial configuration options to merge with existing options
     * @throws {Error} If endpoint is not provided
     */
    constructor(options: Partial<GraphqlAdapterOptions>);
    protected buildRequest(queryBuilder: QueryBuilder): HttpRequest;
    private buildBody;
    private determineOperation;
    private buildGraphQLQuery;
    private buildFields;
    private buildArguments;
    private buildQueryArguments;
    private buildVariables;
    private generateOperationName;
}
/**
 * Configuration options for the HttpClient.
 */
export type GraphqlAdapterOptions = {
    endpoint?: string;
} & HttpAdapterOptions;
