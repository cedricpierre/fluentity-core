import { expect, describe, it, beforeEach, mock, beforeAll, spyOn } from 'bun:test';
import { User } from '../examples/models/User';
import { Fluentity } from '../src/index';
import { Media } from '../examples/models/Media';
import { Thumbnail } from '../examples/models/Thumbnail';
import { QueryBuilder } from '../src/QueryBuilder';
import { Model } from '../src/Model';

let user: User;
let medias: Media[];


let fluentity: Fluentity;

beforeAll(() => {
  Fluentity.reset();
  fluentity = Fluentity.initialize();
});


describe('Models', () => {
  
  beforeEach(() => {
    mock.restore();
  });

  it('can create a user', async () => {

    user = new User({ name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 })

    expect(user).toBeInstanceOf(User)
    expect(user.name).toBe('Cedric')
  })

  it('can fetch all users', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: [
      { id: '456', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }
    ]})

    const users = await User.all()

    expect(users).toBeInstanceOf(Array)
    expect(users).toHaveLength(1)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].id).toBe('456')
    expect(users[0].name).toBe('Cedric')

  })

  it('can create a user with a thumbnail', async () => {
    const thumbnail1 = new Thumbnail({ id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' })
    const thumbnail2 = new Thumbnail({ id: '2', size: 'md', url: 'https://example.com/photo2.jpg' })

    user = new User({ id: '123', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 })
    user.thumbnail = thumbnail1
    user.thumbnails = [thumbnail1, thumbnail2]

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe('123')
    expect(user.name).toBe('Cedric')
    expect(user.thumbnail).toBeInstanceOf(Thumbnail)
    expect(user.thumbnails).toBeInstanceOf(Array)
    expect(user.thumbnails).toHaveLength(2)
    expect(user.thumbnails[0]).toBeInstanceOf(Thumbnail)
    expect(user.thumbnails[1]).toBeInstanceOf(Thumbnail)

  })

  it('can convert user to object', () => {
    user = new User({
      id: '123',
      name: 'Cedric',
      email: 'cedric@example.com',
      phone: 1234567890,
      thumbnail: new Thumbnail({ id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' }),
      thumbnails: [
        new Thumbnail({ id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' }),
        new Thumbnail({ id: '2', size: 'md', url: 'https://example.com/photo2.jpg' })
      ]
    })

    const obj = user.toObject()

    expect(obj).toEqual({
      id: '123',
      name: 'Cedric',
      email: 'cedric@example.com',
      phone: 1234567890,
      thumbnail: {
        id: '1',
        size: 'sm',
        url: 'https://example.com/photo1.jpg'
      },
      thumbnails: [
        {
          id: '1',
          size: 'sm',
          url: 'https://example.com/photo1.jpg'
        },
        {
          id: '2',
          size: 'md',
          url: 'https://example.com/photo2.jpg'
        }
      ]
    })
  })

  it('can fetch all users', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: [
      { id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 },
      { id: '2', name: 'Johana', email: 'johana@example.com', phone: 9876543210 }
    ]})

    const users = await User.all()

    expect(users).toHaveLength(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].name).toBe('Cedric')
  })

  it('can find a user by ID', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({
      data: {
        id: '123',
        name: 'Cedric',
        email: 'cedric@example.com',
        phone: 1234567890
      }
    })

    user = await User.find('123')

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe('123')
    expect(user.name).toBe('Cedric')
  })

  it('can save an instance of a user', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: { id: '123', name: 'Cedric updated', email: 'cedric@example.com', phone: 1234567890 } })

    await user.save()

    expect(user.name).toBe('Cedric updated')
  })

  it('can update a user by ID', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: { id: '123', name: 'Cedric updated', email: 'cedric@example.com', phone: 1234567890 } })

    const updatedUser = await User.update('123', { name: 'Cedric updated' })

    expect(updatedUser).toBeInstanceOf(User)
    expect(updatedUser.name).toBe('Cedric updated')
  })

  it('can create a user by ID', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: { id: '123', name: 'Cedric new', email: 'cedric@example.com', phone: 1234567890 } })

    const createdUser = await User.create({ name: 'Cedric new' })

    expect(createdUser).toBeInstanceOf(User)
    expect(createdUser.name).toBe('Cedric new')
  })

  it('can delete a user by ID', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: {} })

    await User.delete('123')
  })

  it('can fetch all medias from user', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: [
      { id: '1', name: 'Photo 1', url: 'https://example.com/photo1.jpg' },
      { id: '2', name: 'Photo 2', url: 'https://example.com/photo2.jpg' }
    ]})

    medias = await user.medias.all()

    expect(medias).toBeInstanceOf(Array)
    expect(medias).toHaveLength(2)
    expect(medias.every((media: Media) => media instanceof Media)).toBe(true)

  })

  it('can fetch all medias from user with pagination', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: [
      { id: '1', name: 'Photo', url: 'https://example.com/photo1.jpg' }
    ]})
    medias = await user.medias.where({ name: 'Photo' }).paginate(1, 1)

    expect(medias).toBeInstanceOf(Array)
    expect(medias).toHaveLength(1)
    expect(medias.every((media: Media) => media instanceof Media)).toBe(true)
  })

  it('can find a user by its media', async () => {
    const media = medias[0]

    expect(media).toBeInstanceOf(Media)
    expect(media.id).toBe('1')
    expect(media.url).toBe('https://example.com/photo1.jpg')

    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: [
      { id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' }
    ]})

    const allThumbnails = await media.thumbnails.all()

    const thumbnail = allThumbnails[0]

    expect(thumbnail).toBeInstanceOf(Thumbnail)
    expect(thumbnail.id).toBe('1')
    expect(thumbnail.size).toBe('sm')
    expect(thumbnail.url).toBe('https://example.com/photo1.jpg')

    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: [
      { id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' },
      { id: '2', size: 'md', url: 'https://example.com/photo2.jpg' }
    ]})

    const thumbnails = await media.thumbnails.all()

    expect(thumbnails).toBeInstanceOf(Array)
    expect(thumbnails).toHaveLength(2)
    expect(thumbnails.every((thumbnail: Thumbnail) => thumbnail instanceof Thumbnail)).toBe(true)

  })

  it('can find users where name is Cedric and is active', async () => {
    spyOn(fluentity.adapter, 'call').mockImplementation((queryBuilder: QueryBuilder) => {
      expect(queryBuilder.model).toBe(User);
      expect(queryBuilder.query).toEqual({
        name: 'Cedric Pierre',
        email: 'cedric@example.com',
        status: 'active',
      });
      return Promise.resolve({
        data: [{ id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }],
      });
    });

    const users = await User.where({ name: 'Cedric Pierre' })
      .filter({ email: 'cedric@example.com' })
      .active()
      .all();

    expect(users).toHaveLength(1);
    expect(users[0]).toBeInstanceOf(User);
    expect(users[0].name).toBe('Cedric');
  });

  it('generates correct URL with query parameters', async () => {
    const mockCall = spyOn(fluentity.adapter, 'call');
    mockCall.mockImplementation((queryBuilder: QueryBuilder) => {
      expect(queryBuilder.model).toBe(User);
      expect(queryBuilder.query).toEqual({ name: 'Cedric', email: 'cedric@example.com' });
      expect(queryBuilder.limit).toBe(10);
      expect(queryBuilder.offset).toBe(0);
      expect(queryBuilder.page).toBe(1);
      expect(queryBuilder.perPage).toBe(10);
      return Promise.resolve({ data: [] });
    });

    await User.where({ name: 'Cedric' })
      .filter({ email: 'cedric@example.com' })
      .orderBy('created_at', 'desc')
      .paginate(1, 10);

    expect(mockCall).toHaveBeenCalled();
  });

  it('can create a user by ID', async () => {
    const user = User.id(1);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(1);
  });

  it('generates correct URL with relation and query parameters', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({
      data: {
        id: '1',
        name: 'Cedric',
        email: 'cedric@example.com',
        phone: 1234567890,
        thumbnail: new Thumbnail({ id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' }),
        thumbnails: [
          new Thumbnail({ id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' }),
          new Thumbnail({ id: '2', size: 'md', url: 'https://example.com/photo2.jpg' }),
        ],
      },
    });

    const user = await User.find(1);

    spyOn(fluentity.adapter, 'call').mockImplementation(async (queryBuilder: QueryBuilder) => {
      expect(queryBuilder.model).toBe(Media);
      expect(queryBuilder.id).toBe(2);
      expect(queryBuilder.parent?.model).toBe(User);
      expect(queryBuilder.parent?.id).toBe(1);

      return Promise.resolve({
        data: {
          id: '2',
          name: 'thumbnail',
          url: 'https://example.com/thumbnail.jpg',
        },
      });
    });

    const media = await user.medias.find(2);

    expect(media).toBeInstanceOf(Media);
    expect(media.id).toBe('2');
    expect(media.name).toBe('thumbnail');
    expect(media.url).toBe('https://example.com/thumbnail.jpg');

    spyOn(fluentity.adapter, 'call').mockImplementation((queryBuilder: QueryBuilder) => {
      expect(queryBuilder.model).toBe(Thumbnail);
      expect(queryBuilder.id).toBe(undefined);
      expect(queryBuilder.parent?.model).toBe(Media);
      expect(queryBuilder.parent?.id).toBe(2);
      expect(queryBuilder.parent?.parent?.model).toBe(User);
      expect(queryBuilder.parent?.parent?.id).toBe(1);
      return Promise.resolve({
        data: [
          { id: '1', size: 'sm', url: 'https://example.com/thumbnail1.jpg' },
          { id: '2', size: 'md', url: 'https://example.com/thumbnail2.jpg' },
        ],
      });
    });

    const thumbnails = await media.thumbnails.all();

    expect(thumbnails).toBeInstanceOf(Array);
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails.every((thumbnail: Thumbnail) => thumbnail instanceof Thumbnail)).toBe(true);
  });

  it('generates deep nested relations', async () => {
    spyOn(fluentity.adapter, 'call').mockImplementation((queryBuilder: QueryBuilder) => {
      expect(queryBuilder.model).toBe(Thumbnail);
      expect(queryBuilder.id).toBe(undefined);
      expect(queryBuilder.parent?.model).toBe(Media);
      expect(queryBuilder.parent?.id).toBe(2);
      expect(queryBuilder.parent?.parent?.model).toBe(User);
      expect(queryBuilder.parent?.parent?.id).toBe(1);
      return Promise.resolve({ data: [] });
    });

    await User.id(1).medias.id(2).thumbnails.all();
  });

  it('can use the query method', async () => {
    spyOn(fluentity.adapter, 'call')
      .mockImplementation((queryBuilder: QueryBuilder) => {
        expect(queryBuilder.model).toBe(User);
        expect(queryBuilder.query).toEqual({ name: 'Cedric' });
        return Promise.resolve({ data: [] });
      })
      .mockResolvedValue({
        data: [{ id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }],
      });

    const users = await User.query().where({ name: 'Cedric' }).all();

    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(1);
    expect(users[0]).toBeInstanceOf(User);
    expect(users[0].name).toBe('Cedric');
  });

  it('can use the get method', async () => {
    spyOn(fluentity.adapter, 'call').mockImplementation((queryBuilder: QueryBuilder) => {
      expect(queryBuilder.model).toBe(User);
      expect(queryBuilder.id).toBe(1);
      return Promise.resolve({
        data: { id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 },
      });
    });

    const user = await User.id(1).get();

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe('1');
    expect(user.name).toBe('Cedric');
  });

  it('can use the filter method', async () => {
    spyOn(fluentity.adapter, 'call').mockImplementation((queryBuilder: QueryBuilder) => {
      console.log(queryBuilder.model);
      expect(queryBuilder.model).toBe(User);
      expect(queryBuilder.query).toEqual({ name: 'Cedric' });
      return Promise.resolve({
        data: [{ id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }],
      });
    });

    const users = await User.filter({ name: 'Cedric' }).all();

    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(1);
    expect(users[0]).toBeInstanceOf(User);
    expect(users[0].name).toBe('Cedric');
  });
});

describe('Model protected methods', () => {
  let testUser: User;
  let mockQueryBuilder: QueryBuilder;

  beforeEach(() => {
    testUser = new User({
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      phone: 1234567890,
    });
    mockQueryBuilder = new QueryBuilder({
      model: User as typeof Model,
      id: '123',
    });
    mock.restore();
  });

  it('should call the adapter with the query builder', async () => {
    const mockResponse = { data: { id: '123', name: 'Updated User' } };
    const spy = spyOn(fluentity.adapter, 'call').mockResolvedValue(mockResponse);

    // Access the protected call method through a test subclass
    class TestModel extends Model {
      public testCall() {
        return this.call(mockQueryBuilder);
      }
    }

    const testModel = new TestModel({ id: '123' });
    const result = await testModel.testCall();

    expect(spy).toHaveBeenCalledWith(mockQueryBuilder);
    expect(result).toEqual(mockResponse);
  });

  it('should handle adapter errors gracefully', async () => {
    const error = new Error('API Error');
    spyOn(fluentity.adapter, 'call').mockRejectedValue(error);

    class TestModel extends Model {
      public testCall(qb: QueryBuilder) {
        return this.call(qb);
      }
    }

    const testModel = new TestModel({ id: '123' });

    await expect(testModel.testCall(mockQueryBuilder)).rejects.toThrow('API Error');
  });

  it('should maintain type safety with the adapter response', async () => {
    const mockResponse = {
      data: {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        phone: 1234567890,
      },
    };
    spyOn(fluentity.adapter, 'call').mockResolvedValue(mockResponse);

    class TestModel extends Model {
      public testCall(qb: QueryBuilder) {
        return this.call(qb);
      }
    }

    const testModel = new TestModel({ id: '123' });
    const result = await testModel.testCall(mockQueryBuilder);

    // Verify the response maintains the correct type structure
    expect(result.data).toHaveProperty('id');
    expect(result.data).toHaveProperty('name');
    expect(result.data).toHaveProperty('email');
    expect(result.data).toHaveProperty('phone');
    expect(typeof result.data.id).toBe('string');
    expect(typeof result.data.name).toBe('string');
    expect(typeof result.data.email).toBe('string');
    expect(typeof result.data.phone).toBe('number');
  });
});