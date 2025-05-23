import { RestAdapter } from "./adapters/RestAdapter"
import { Methods, MethodType } from "./Fluentity"
import { Model, Attributes } from "./Model"
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
        this.queryBuilder.method = Methods.GET
        this.queryBuilder.id = this.relatedModel.id!
        const response = await this.fluentity.adapter.call(this.queryBuilder)
        return new (this.relatedModel as any)(response.data, {...this.queryBuilder})
    }

    /**
     * Updates the related model instance.
     * @param data - The data to update the related model with
     * @returns A promise that resolves to the updated model instance
     */
    async update<A extends Partial<Attributes>>(data: A, method: MethodType = Methods.PUT): Promise<T> {
        this.queryBuilder.method = method
        this.queryBuilder.id = this.relatedModel.id!
        const response = await this.fluentity.adapter.call(this.queryBuilder)
        return new (this.relatedModel as any)(response.data, {...this.queryBuilder})
    }

    /**
     * Deletes the related model instance.
     * @returns A promise that resolves when the deletion is complete
     */
    async delete(): Promise<void> {
        this.queryBuilder.method = Methods.DELETE
        this.queryBuilder.id = this.relatedModel.id!
        await this.fluentity.adapter.call(this.queryBuilder)
    }
}
