import { expect, describe, it, beforeEach, beforeAll, mock, spyOn } from 'bun:test'
import { User } from '../examples/models/User'
import { Fluentity, RestAdapter } from '../src/index'
import { Media } from '../examples/models/Media'
import { Thumbnail } from '../examples/models/Thumbnail'
import { QueryBuilder } from '../src/QueryBuilder'


let fluentity: Fluentity;
beforeAll(() => {
  Fluentity.reset();
  fluentity = Fluentity.initialize({
    adapter: new RestAdapter({
      baseUrl: 'https://jsonplaceholder.typicode.com',
    }),
  })
});



describe('Models', () => {
  
  beforeEach(() => {
    mock.restore()
  })

  
  it('should be able to get medias from a user', async () => {

    spyOn(fluentity.adapter, 'call').mockResolvedValue({
        data: [
          { id: 1, name: 'Media 1' },
          { id: 2, name: 'Media 2' },
        ]
      })

    const medias = await User.id(1).medias.all()

    expect(medias).toBeInstanceOf(Array)
    expect(medias).toHaveLength(2)
    expect(medias[0]).toBeInstanceOf(Media)
  })
  
  it('should be able to get libraries (custom name) from a user', async () => {
    spyOn(fluentity.adapter, 'call').mockImplementation((queryBuilder: QueryBuilder) => {
      expect(queryBuilder.resource).toBe('medias');
      expect(queryBuilder.id).toBeUndefined();
      expect(queryBuilder.parent?.resource).toBe('users');
      expect(queryBuilder.parent?.id).toBe(1);

      return Promise.resolve({
        data: [
          { id: 1, name: 'Media 1' },
          { id: 2, name: 'Media 2' },
        ],
      });
    });

    const media = await User.id(1).libraries.all();
    expect(media).toBeInstanceOf(Array);
    expect(media).toHaveLength(2);
    expect(media[0]).toBeInstanceOf(Media);
  });

  it('should be able to cast thumbnail', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({
      data: {
        id: 1,
        thumbnail: {
          id: 1,
          url: 'https://example.com/thumbnail.jpg',
          width: 100,
          height: 100,
        },
      },
    });

    const user = await User.find(1);
    expect(user.thumbnail).toBeInstanceOf(Thumbnail);
    expect(user.thumbnail.url).toBe('https://example.com/thumbnail.jpg');
  });

  it('can create a new instance of a model', async () => {
    const user = new User({ name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 });

    expect(user).toBeDefined();

    user.thumbnail = new Thumbnail({ id: 1, url: 'https://example.com/thumbnail.jpg' });
    expect(user.thumbnail).toBeInstanceOf(Thumbnail);
  });

  it('should construct correct path with custom resource name', async () => {
    spyOn(fluentity.adapter, 'call').mockImplementation((queryBuilder: QueryBuilder) => {
      expect(queryBuilder.resource).toBe('custom-resource');
      expect(queryBuilder.id).toBeUndefined();
      expect(queryBuilder.parent?.resource).toBe('users');
      expect(queryBuilder.parent?.id).toBe(1);
      return Promise.resolve({ data: [] });
    });

    const result = await User.id(1).customResource.all();
    expect(result).toBeInstanceOf(Array);
  });

  it('should construct correct path with default resource name', async () => {
    spyOn(fluentity.adapter, 'call').mockImplementation((queryBuilder: QueryBuilder) => {
      expect(queryBuilder.resource).toBe('medias');
      expect(queryBuilder.id).toBeUndefined();
      expect(queryBuilder.parent?.resource).toBe('users');
      expect(queryBuilder.parent?.id).toBe(1);
      return Promise.resolve({ data: [] });
    });

    const result = await User.id(1).medias.all();
    expect(result).toBeInstanceOf(Array);
  });

  it('should handle nested paths correctly', async () => {
    spyOn(fluentity.adapter, 'call').mockImplementation((queryBuilder: QueryBuilder) => {
      expect(queryBuilder.resource).toBe('thumbnails');
      expect(queryBuilder.id).toBeUndefined();
      expect(queryBuilder.parent?.resource).toBe('medias');
      expect(queryBuilder.parent?.id).toBe(2);
      expect(queryBuilder.parent?.parent?.resource).toBe('users');
      expect(queryBuilder.parent?.parent?.id).toBe(1);
      return Promise.resolve({ data: [] });
    });
    const result = await User.id(1).medias.id(2).thumbnails.all();
    expect(result).toBeInstanceOf(Array);
  });

  it('should handle empty path correctly', async () => {
    spyOn(fluentity.adapter, 'call').mockImplementation((queryBuilder: QueryBuilder) => {
      expect(queryBuilder.resource).toBe('users');
      expect(queryBuilder.id).toBe(1);
      return Promise.resolve({ data: { id: 1, name: 'Cedric' } });
    });

    const result = await User.id(1).get();
    expect(result).toBeDefined();
  });
})