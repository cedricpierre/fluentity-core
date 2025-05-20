import { HttpClient, Methods } from "./HttpClient"
import { Attributes, Model } from "./Model"
import { RelationBuilder } from "./RelationBuilder"

/**
 * Builder class for has-many relationships between models.
 * Provides methods for managing a one-to-many relationship with another model.
 * @template T - The type of model this relation builder works with
 */
export class HasManyRelationBuilder<T extends Model<any>> extends RelationBuilder<T> {
    /**
     * Fetches all related model instances.
     * @returns A promise that resolves to an array of related model instances
     */
    async all(): Promise<T[]> {
        const list = await HttpClient.call(this.buildUrl())
        return list?.map((i: any) => new (this.relatedModel as any)(i))
    }

    /**
     * Creates a new related model instance.
     * @param data - The data to create the new model with
     * @returns A promise that resolves to the created model instance
     */
    async create<A extends Partial<Attributes>>(data: A): Promise<T> {
        const response = await HttpClient.call(this.path, {
            method: Methods.POST,
            body: data
        })
        return new (this.relatedModel as any)(response)
    }

    /**
     * Deletes a related model instance by ID.
     * @param id - The ID of the model to delete
     * @returns A promise that resolves when the deletion is complete
     */
    async delete(id: string | number): Promise<void> {
        await HttpClient.call(`${this.path}/${id}`, { method: Methods.DELETE })
    }

    /**
     * Updates a related model instance by ID.
     * @param id - The ID of the model to update
     * @param data - The data to update the model with
     * @returns A promise that resolves to the updated model instance
     */
    async update<A extends Partial<Attributes>>(id: string | number, data: A): Promise<T> {
        const response = await HttpClient.call(`${this.path}/${id}`, {
            method: Methods.PUT,
            body: data
        })
        return new (this.relatedModel as any)(response)
    }

    /**
     * Fetches a paginated list of related model instances.
     * @param page - The page number to fetch (default: 1)
     * @param perPage - The number of items per page (default: 10)
     * @returns A promise that resolves to an array of related model instances
     */
    async paginate(page = 1, perPage = 10): Promise<T[]> {
        this.queryBuilder.page(page)
            .perPage(perPage)
            .offset((page - 1) * perPage)
            .limit(perPage)

        const list = await HttpClient.call(this.buildUrl())
        return list?.map((i: any) => new (this.relatedModel as any)(i))
    }
}
