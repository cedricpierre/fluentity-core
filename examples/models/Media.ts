import { Model, HasMany, Relation, Attributes, BelongsTo } from '../../src/index'

import { User } from './User'
import { Thumbnail } from './Thumbnail'

export interface IMedia extends Attributes {
    id: string
    name: string
    size: string
    extension: string
    mime_type: string
    url: string
}

export class Media extends Model<IMedia> {
    static resource = 'medias'

    @BelongsTo(() => User)
    user!: Relation<User>

    @HasMany(() => Thumbnail)
    thumbnails!: Relation<Thumbnail[]>
}