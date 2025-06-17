import { Methods, MethodType } from './index';
import { Model, Attributes } from './Model';
import { RelationBuilder } from './RelationBuilder';

/**
 * Builder class for has-one relationships between models.
 * Provides methods for managing a one-to-one relationship with another model.
 * Used when a model has exactly one related model instance.
 * 
 * Features:
 * - Single model retrieval
 * - Model updates
 * - Model deletion
 * - Relationship traversal
 *
 * @template T - The type of model this relation builder works with
 * @example
 * ```typescript
 * // Basic usage in a model
 * class User extends Model {
 *   @HasOne(() => Profile)
 *   profile: Profile;
 * }
 * 
 * // Usage in queries
 * const profile = await user.profile.get();
 * await user.profile.update({ bio: 'New bio' });
 * await user.profile.delete();
 * ```
 */
export class HasOneRelationBuilder<T extends Model<Attributes>> extends RelationBuilder<T> {
  /**
   * Fetches the related model instance.
   * Makes a GET request to retrieve the single related model.
   * Throws an error if the related model is not found.
   *
   * @returns A promise that resolves to the related model instance
   * @throws {Error} If the related model is not found
   * @example
   * ```typescript
   * // Get user's profile
   * const profile = await user.profile.get();
   * console.log(`Profile bio: ${profile.bio}`);
   * 
   * // Get with error handling
   * try {
   *   const profile = await user.profile.get();
   *   console.log('Profile loaded successfully');
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('Profile not found');
   *   } else {
   *     console.error('Error loading profile:', error);
   *   }
   * }
   * 
   * // Use in relationship chain
   * const post = await user.posts.find(123);
   * const authorProfile = await post.author.profile.get();
   * ```
   */
  async get(): Promise<T> {
    this.queryBuilder.method = Methods.GET;
    const response = await this.fluentity.adapter.call(this.queryBuilder);
    return this.data = new (this.relatedModel as any)(response.data, { ...this.queryBuilder, id: response.data.id });
  }

  /**
   * Updates the related model instance.
   * Makes a PUT/PATCH request to update the single related model.
   * Can use either PUT (full update) or PATCH (partial update).
   *
   * @param data - The data to update the related model with
   * @param method - The HTTP method to use (PUT or PATCH)
   * @returns A promise that resolves to the updated model instance
   * @throws {Error} If the update fails
   * @example
   * ```typescript
   * // Full update with PUT
   * const profile = await user.profile.update({
   *   bio: 'New bio',
   *   location: 'New York',
   *   website: 'https://example.com'
   * });
   * 
   * // Partial update with PATCH
   * const profile = await user.profile.update({
   *   bio: 'Updated bio'
   * }, Methods.PATCH);
   * 
   * // Update with error handling
   * try {
   *   const profile = await user.profile.update({
   *     bio: 'New bio'
   *   });
   *   console.log('Profile updated successfully');
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('Profile not found');
   *   } else if (error.status === 422) {
   *     console.log('Validation failed:', error.errors);
   *   } else {
   *     console.error('Error updating profile:', error);
   *   }
   * }
   * ```
   */
  async update<A extends Partial<Attributes>>(
    data: A,
    method: MethodType = Methods.PUT
  ): Promise<T> {
    this.queryBuilder.method = method;
    this.queryBuilder.id = this.relatedModel.id!;
    const response = await this.fluentity.adapter.call(this.queryBuilder);
    return this.data = new (this.relatedModel as any)(response.data, { ...this.queryBuilder, id: response.data.id });
  }

  /**
   * Deletes the related model instance.
   * Makes a DELETE request to remove the single related model.
   * The local instance remains but becomes detached from the server.
   *
   * @returns A promise that resolves when the deletion is complete
   * @throws {Error} If the deletion fails
   * @example
   * ```typescript
   * // Delete the profile
   * await user.profile.delete();
   * 
   * // Delete with error handling
   * try {
   *   await user.profile.delete();
   *   console.log('Profile deleted successfully');
   * } catch (error) {
   *   if (error.status === 404) {
   *     console.log('Profile not found');
   *   } else {
   *     console.error('Error deleting profile:', error);
   *   }
   * }
   * 
   * // Delete in relationship chain
   * const post = await user.posts.find(123);
   * await post.author.profile.delete();
   * ```
   */
  async delete(): Promise<void> {
    this.queryBuilder.method = Methods.DELETE;
    this.queryBuilder.id = this.relatedModel.id!;
    await this.fluentity.adapter.call(this.queryBuilder);
  }
}
