import { Model, Attributes } from "./Model"
import { HttpClient, Methods } from "./HttpClient"
import { RelationBuilder } from "./RelationBuilder"

/**
 * Builder class for has-one relationships between models.
 * Provides methods for managing a one-to-one relationship with another model.
 * @template T - The type of model this relation builder works with
 */
export class HasOneRelationBuilder<T extends Model<any>> extends RelationBuilder<T> {
    /**
     * Fetches the related model instance.
     * @returns A promise that resolves to the related model instance
     */
    async get(): Promise<T> {
        const response = await HttpClient.call(`${this.path}/${this.relatedModel.id}`, { method: Methods.GET })
        return new (this.relatedModel as any)(response.data)
    }

    /**
     * Updates the related model instance.
     * @param data - The data to update the related model with
     * @returns A promise that resolves to the updated model instance
     */
    async update<A extends Partial<Attributes>>(data: A): Promise<T> {
        const updated = await HttpClient.call(`${this.path}/${this.relatedModel.id}`, {
            method: Methods.PATCH,
            body: data
        })
        return new (this.relatedModel as any)(updated.data)
    }

    /**
     * Deletes the related model instance.
     * @returns A promise that resolves when the deletion is complete
     */
    async delete(): Promise<void> {
        await HttpClient.call(`${this.path}/${this.relatedModel.id}`, { method: Methods.DELETE })
    }
}
