import { MethodType } from "./Fluentity"


export interface QueryBuilderInterface {
    path?: string
    query?: Record<string, any>
    sort?: string
    direction?: string
    limit?: number
    offset?: number
    page?: number
    perPage?: number
    id?: string | number
    method?: MethodType
    body?: any
}
/**
 * Builder class for constructing URL query strings.
 * Provides methods for building and managing query parameters for API requests.
 */
export class QueryBuilder implements QueryBuilderInterface {
    /** The base path for the URL */
    public path?: string
    /** The query parameters for the URL */
    public query?: Record<string, any> = {}
    /** The sort order for the query */
    public sort?: string
    /** The direction for the query */
    public direction?: string
    /** The limit for the query */
    public limit?: number
    /** The offset for the query */
    public offset?: number
    /** The page number for the query */
    public page?: number
    /** The number of items per page for the query */
    public perPage?: number
    /** The ID for the query */
    public id?: string | number
    /** The method for the query */
    public method?: MethodType
    /** The body for the query */
    public body?: any


    /**
     * Adds where conditions to the query.
     * @param where - Object containing field-value pairs to filter by
     * @returns The QueryBuilder instance for chaining
     */
    where(where: Record<string, any>): this {
        this.filter(where)
        return this
    }

    /**
     * Adds filter conditions to the query.
     * @param filters - Object containing filter conditions
     * @returns The QueryBuilder instance for chaining
     */
    filter(filters: Record<string, any>): this {
        this.query = { ...this.query, ...filters }
        
        return this
    }

    /**
     * Resets the query builder to its initial state.
     * @returns The QueryBuilder instance for chaining
     */
    reset(): this {
        this.query = {}
        this.sort = undefined
        this.direction = undefined
        this.limit = undefined
        this.offset = undefined
        this.page = undefined
        this.perPage = undefined
        this.id = undefined
        this.path = ''
        this.method = undefined
        return this
    }

    toObject(): Record<string, any> {
        return Object.entries({
            path: this.path,
            query: this.query,
            method: this.method,
            sort: this.sort,
            direction: this.direction,
            limit: this.limit,
            offset: this.offset,
            page: this.page,
            perPage: this.perPage,
        }).filter(([_, value]) => value !== undefined).reduce((acc: Record<string, any>, [key, value]) => {
            acc[key] = value
            return acc
        }, {})
    }
}