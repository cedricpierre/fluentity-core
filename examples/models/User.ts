import {
  Model,
  HasMany,
  Relation,
  Attributes,
  Cast,
  HasOne,
  RelationBuilder,
  Methods,
  AdapterResponse,
} from '../../src/index';

import { Company } from './Company';

import { Media } from './Media';
import { Thumbnail } from './Thumbnail';

import { QueryBuilder } from '../../src/QueryBuilder';

interface UserAttributes extends Attributes {
  name: string;
  phone: number;
  email: string;
  created_at?: string;
  updated_at?: string;
  thumbnail?: Thumbnail;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  static resource = 'users';

  name!: string;
  email!: string;
  phone!: number;
  created_at?: string;
  updated_at?: string;

  @HasMany(() => Media)
  medias!: Relation<Media[]>;

  @HasMany(() => Media, 'medias')
  libraries!: Relation<Media[]>;

  @HasMany(() => Media, 'custom-resource')
  customResource!: Relation<Media[]>;

  @HasOne(() => Media)
  picture!: Relation<Media>;

  @Cast(() => Thumbnail)
  thumbnail!: Thumbnail;

  @Cast(() => Thumbnail)
  thumbnails!: Thumbnail[];

  @Cast(() => Company)
  company!: Company;

  static scopes = {
    active: (query: RelationBuilder<User>) => query.where({ status: 'active' }),
  };

  static async login(username: string, password: string) {
    const queryBuilder = new QueryBuilder({
      resource: 'login',
      body: {
        username,
        password,
      },
      method: Methods.POST,
    });

    const response = await this.call(queryBuilder);

    return new this(response.data);
  }
}
