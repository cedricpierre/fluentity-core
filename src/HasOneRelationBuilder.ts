import { Methods, MethodType } from './Fluentity';
import { Model, Attributes } from './Model';
import { RelationBuilder } from './RelationBuilder';

/**
 * Builder class for has-one relationships between models.
 * Provides methods for managing a one-to-one relationship with another model.
 * Used when a model has exactly one related model instance.
 *
 * @template T - The type of model this relation builder works with
 * @example
 * ```typescript
 * class User {
 *   @HasOne(() => Profile)
 *   profile: Profile;
 * }
 * ```
 */
export class HasOneRelationBuilder<T extends Model<Attributes>> extends RelationBuilder<T> {
  /**
   * Fetches the related model instance.
   * Makes a GET request to retrieve the single related model.
   *
   * @returns A promise that resolves to the related model instance
   * @throws {Error} If the related model is not found
   * @example
   * ```typescript
   * const profile = await user.profile.get();
   * ```
   */
  async get(): Promise<T> {
    this.queryBuilder.method = Methods.GET;
    this.queryBuilder.id = this.relatedModel.id!;
    const response = await this.fluentity.adapter.call(this.queryBuilder);
    return new (this.relatedModel as any)(response.data, { ...this.queryBuilder });
  }

  /**
   * Updates the related model instance.
   * Makes a PUT/PATCH request to update the single related model.
   *
   * @param data - The data to update the related model with
   * @param method - The HTTP method to use (PUT or PATCH)
   * @returns A promise that resolves to the updated model instance
   * @throws {Error} If the update fails
   * @example
   * ```typescript
   * const profile = await user.profile.update({
   *   bio: 'New bio',
   *   location: 'New York'
   * });
   * ```
   */
  async update<A extends Partial<Attributes>>(
    data: A,
    method: MethodType = Methods.PUT
  ): Promise<T> {
    this.queryBuilder.method = method;
    this.queryBuilder.id = this.relatedModel.id!;
    const response = await this.fluentity.adapter.call(this.queryBuilder);
    return new (this.relatedModel as any)(response.data, { ...this.queryBuilder });
  }

  /**
   * Deletes the related model instance.
   * Makes a DELETE request to remove the single related model.
   *
   * @returns A promise that resolves when the deletion is complete
   * @throws {Error} If the deletion fails
   * @example
   * ```typescript
   * await user.profile.delete();
   * ```
   */
  async delete(): Promise<void> {
    this.queryBuilder.method = Methods.DELETE;
    this.queryBuilder.id = this.relatedModel.id!;
    await this.fluentity.adapter.call(this.queryBuilder);
  }
}
