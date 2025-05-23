import { Model, HasMany, Relation } from '../../src/index';

import { Comment } from './Comment';

export class Post extends Model<any> {
  static resource = 'posts';

  @HasMany(() => Comment)
  comments!: Relation<Comment[]>;
}
