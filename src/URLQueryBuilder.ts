/**
 * Builder class for constructing URL query strings.
 * Provides methods for building and managing query parameters for API requests.
 */
export class URLQueryBuilder {
    /** The base path for the URL */
    private _path: string = ''
    /** The query parameters to include in the URL */
    private _query: Record<string, any> = {}
    private _includes: string[] = []
    private _sort: string[] = []
    private _limit?: number
    private _offset?: number
    private _page?: number
    private _perPage?: number
    private _id?: string | number

    /**
     * Sets the base path for the URL.
     * @param path - The path to set
     * @returns The URLQueryBuilder instance for chaining
     */
    path(path: string): this {
        this._path = path
        return this
    }

    /**
     * Adds an ID parameter to the query.
     * @param id - The ID to add
     * @returns The URLQueryBuilder instance for chaining
     */
    id(id: string | number): this {
        this._id = id
        return this
    }

    /**
     * Adds where conditions to the query.
     * @param where - Object containing field-value pairs to filter by
     * @returns The URLQueryBuilder instance for chaining
     */
    where(where: Record<string, any>): this {
        return this.filter(where)
    }

    /**
     * Adds filter conditions to the query.
     * @param filters - Object containing filter conditions
     * @returns The URLQueryBuilder instance for chaining
     */
    filter(filters: Record<string, any>): this {
        this._query = { ...this._query, ...filters }
        return this
    }

    /**
     * Adds relations to include in the query.
     * @param relations - Single relation name or array of relation names to include
     * @returns The URLQueryBuilder instance for chaining
     */
    include(relations: string | string[]): this {
        this._includes.push(...(Array.isArray(relations) ? relations : [relations]))
        return this
    }

    /**
     * Adds an order by clause to the query.
     * @param field - The field to order by
     * @param dir - The direction to order in ('asc' or 'desc')
     * @returns The URLQueryBuilder instance for chaining
     */
    orderBy(field: string, dir: string = 'asc'): this {
        this._sort.push(`${dir === 'desc' ? '-' : ''}${field}`)
        return this
    }

    /**
     * Sets the page number for pagination.
     * @param page - The page number
     * @returns The URLQueryBuilder instance for chaining
     */
    page(page: number): this {
        this._page = page
        return this
    }

    /**
     * Sets the number of items per page for pagination.
     * @param perPage - The number of items per page
     * @returns The URLQueryBuilder instance for chaining
     */
    perPage(perPage: number): this {
        this._perPage = perPage
        return this
    }

    /**
     * Sets the offset for pagination.
     * @param offset - The offset value
     * @returns The URLQueryBuilder instance for chaining
     */
    offset(offset: number): this {
        this._offset = offset
        return this
    }

    /**
     * Sets the limit for the number of results.
     * @param limit - The maximum number of results
     * @returns The URLQueryBuilder instance for chaining
     */
    limit(limit: number): this {
        this._limit = limit
        return this
    }

    /**
     * Resets the query builder to its initial state.
     * @returns The URLQueryBuilder instance for chaining
     */
    reset(): this {
        this._query = {}
        this._includes = []
        this._sort = []
        this._limit = undefined
        this._offset = undefined
        this._page = undefined
        this._perPage = undefined
        this._id = undefined
        this._path = ''
        return this
    }

    /**
     * Builds the final URL with all query parameters.
     * @returns The constructed URL string
     */
    toUrl(): string {
        let url = this._path

        if (this._id) {
            url += `/${String(this._id)}`
        }

        if (this.toQueryString()) {
            url += `?${this.toQueryString()}`
        }

        return url
    }

    toQueryString(): string {
        const obj: Record<string, any> = { ...this._query }
        if (this._includes.length) obj.include = this._includes.join(',')
        if (this._sort.length) obj.sort = this._sort.join(',')
        if (this._limit !== undefined) obj.limit = this._limit
        if (this._offset !== undefined) obj.offset = this._offset
        if (this._page !== undefined) obj.page = this._page
        if (this._perPage !== undefined) obj.per_page = this._perPage

        return Object.entries(obj)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
    }
}