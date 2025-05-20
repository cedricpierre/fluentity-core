import { describe, it, expect, vi, beforeEach } from 'vitest'
import { User } from '../examples/models/User'
import { Fluentity, Methods } from '../src/index'
import { Media } from '../examples/models/Media'
import { Thumbnail } from '../examples/models/Thumbnail'

let user: User
let medias: Media[]
const baseUrl = 'http://localhost:3000'
Fluentity.configure({
  baseUrl
})

describe('Models', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  

  it('can create a user', async () => {
    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: { id: '123', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 } })

    user = new User({ name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 })
    await user.save()

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe('123')
    expect(user.name).toBe('Cedric')

    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: [
      { id: '456', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }
    ]})

  })

  it('can fetch all users', async () => {
    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: [
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
    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: [
      { id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 },
      { id: '2', name: 'Johana', email: 'johana@example.com', phone: 9876543210 }
    ]})

    const users = await User.all()

    expect(users).toHaveLength(2)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].name).toBe('Cedric')
  })

  it('can find a user by ID', async () => {
    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: {
      id: '123',
      name: 'Cedric',
      email: 'cedric@example.com',
      phone: 1234567890
    }})

    user = await User.find('123')

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe('123')
    expect(user.name).toBe('Cedric')
  })

  it('can save an instance of a user', async () => {
    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: { id: '123', name: 'Cedric updated', email: 'cedric@example.com', phone: 1234567890 }})

    await user.save()

    expect(user.name).toBe('Cedric updated')
  })

  it('can update a user by ID', async () => {
    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: { id: '123', name: 'Cedric updated', email: 'cedric@example.com', phone: 1234567890 }})

    const updatedUser = await User.update('123', { name: 'Cedric updated' })

    expect(updatedUser).toBeInstanceOf(User)
    expect(updatedUser.name).toBe('Cedric updated')
  })

  it('can create a user by ID', async () => {
    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: { id: '123', name: 'Cedric new', email: 'cedric@example.com', phone: 1234567890 }})

    const createdUser = await User.create({ name: 'Cedric new' })

    expect(createdUser).toBeInstanceOf(User)
    expect(createdUser.name).toBe('Cedric new')
  })

  it('can delete a user by ID', async () => {
    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: true })

    await User.delete('123')
  })

  it('can fetch all medias from user', async () => {
    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: [
      { id: '1', name: 'Photo 1', url: 'https://example.com/photo1.jpg' },
      { id: '2', name: 'Photo 2', url: 'https://example.com/photo2.jpg' }
    ]})

    medias = await user.medias.all()

    expect(medias).toBeInstanceOf(Array)
    expect(medias).toHaveLength(2)
    expect(medias.every((media: Media) => media instanceof Media)).toBe(true)

  })


  it('can fetch all medias from user with pagination', async () => {
    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: [
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

    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: user })

    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: [
      { id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' }
    ]})

    const allThumbnails = await media.thumbnails.all()

    const thumbnail = allThumbnails[0]

    expect(thumbnail).toBeInstanceOf(Thumbnail)
    expect(thumbnail.id).toBe('1')
    expect(thumbnail.size).toBe('sm')
    expect(thumbnail.url).toBe('https://example.com/photo1.jpg')

    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: [
      { id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' },
      { id: '2', size: 'md', url: 'https://example.com/photo2.jpg' }
    ]})

    const thumbnails = await media.thumbnails.all()

    expect(thumbnails).toBeInstanceOf(Array)
    expect(thumbnails).toHaveLength(2)
    expect(thumbnails.every((thumbnail: Thumbnail) => thumbnail instanceof Thumbnail)).toBe(true)
    
  })

  it('can find users where name is Cedric and is active', async () => {
    vi.spyOn(Fluentity, 'call')
    .mockImplementation((url) => {
      expect(url).toBe(`users?name=Cedric&email=cedric@example.com&status=active&include=medias`)
      expect(url.includes('status=active')).toBeTruthy()
      expect(url.includes('include=medias')).toBeTruthy()
      expect(url.includes('email=cedric@example.com')).toBeTruthy()
      expect(url.includes('name=Cedric')).toBeTruthy()
      return Promise.resolve({ data: [{ id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }] })
    })

    const users = await User
      .where({ name: 'Cedric' })
      .filter({ email: 'cedric@example.com' })
      .include('medias')
      .active()
      .all()


    expect(users).toHaveLength(1)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].name).toBe('Cedric')
  })

  it('generates correct URL with query parameters', async () => {
    const mockCall = vi.spyOn(Fluentity, 'call')
    mockCall.mockImplementation((url) => {
      expect(url).toBe(`users?name=Cedric&email=cedric@example.com&include=medias,profile&sort=-created_at&limit=10&offset=0&page=1&per_page=10`)
      expect(url.includes('name=Cedric')).toBeTruthy()
      expect(url.includes('email=cedric@example.com')).toBeTruthy()
      expect(url.includes('include=medias,profile')).toBeTruthy()
      expect(url.includes('page=1')).toBeTruthy()
      expect(url.includes('per_page=10')).toBeTruthy()
      return Promise.resolve({ data: [] })
    })

    await User
      .where({ name: 'Cedric' })
      .filter({ email: 'cedric@example.com' })
      .include(['medias', 'profile'])
      .orderBy('created_at', 'desc')
      .paginate(1, 10)

    expect(mockCall).toHaveBeenCalled()
  })

  it('can create a user by ID', async () => {
    const user = User.id(1)

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(1)
  })

  it('generates correct URL with relation and query parameters', async () => {

    vi.spyOn(Fluentity, 'call').mockResolvedValue({ data: {
      id: '123',
      name: 'Cedric',
      email: 'cedric@example.com',
      phone: 1234567890,
      thumbnail: new Thumbnail({ id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' }),
      thumbnails: [
          new Thumbnail({ id: '1', size: 'sm', url: 'https://example.com/photo1.jpg' }),
          new Thumbnail({ id: '2', size: 'md', url: 'https://example.com/photo2.jpg' })
      ]
    }})

    const user = await User.find(1)

    vi.spyOn(Fluentity, 'call').mockImplementation((url) => {
      expect(url).toBe(`users/1/medias/2?include=thumbnails`)
      expect(url.includes('include=thumbnails')).toBeTruthy()

      return Promise.resolve({ data: { 
        id: '2',
        name: 'thumbnail',
        url: 'https://example.com/thumbnail.jpg'
      }})
    })    
  
    const media = await user.medias.include('thumbnails').find(2)

    expect(media).toBeInstanceOf(Media)
    expect(media.id).toBe('2')
    expect(media.name).toBe('thumbnail')
    expect(media.url).toBe('https://example.com/thumbnail.jpg')

    vi.spyOn(Fluentity, 'call').mockImplementation((url) => {
      expect(url).toBe(`users/1/medias/2/thumbnails?include=size`)
      expect(url.includes('include=size')).toBeTruthy()
      return Promise.resolve({ data: [
        { id: '1', size: 'sm', url: 'https://example.com/thumbnail1.jpg' },
        { id: '2', size: 'md', url: 'https://example.com/thumbnail2.jpg' }
      ]})
    })    

    const thumbnails = await media.thumbnails.include('size').all()

    expect(thumbnails).toBeInstanceOf(Array)
    expect(thumbnails).toHaveLength(2)
    expect(thumbnails.every((thumbnail: Thumbnail) => thumbnail instanceof Thumbnail)).toBe(true)
  })


  it('generates deep nested relations', async () => {

    vi.spyOn(Fluentity, 'call').mockImplementation((url) => {
      expect(url).toBe(`users/1/medias/2/thumbnails?include=size`)
      expect(url.includes('include=size')).toBeTruthy()
      return Promise.resolve({ data: [] })
    })

    await User.id(1).medias.id(2).thumbnails.include('size').all();
  })

  it('can use the query method', async () => {
    vi.spyOn(Fluentity, 'call').mockImplementation((url) => {
      expect(url).toBe(`users?name=Cedric`)
      expect(url.includes('name=Cedric')).toBeTruthy()
      expect(url.includes('include=medias')).toBeTruthy()
      return Promise.resolve({ data: [] })
    })
    .mockResolvedValue({ data: [
      { id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }
    ]})

    const users = await User.query().include('medias').where({ name: 'Cedric' }).all()

    expect(users).toBeInstanceOf(Array)
    expect(users).toHaveLength(1)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].name).toBe('Cedric')
  })

  it('can use the get method', async () => {
    vi.spyOn(Fluentity, 'call').mockImplementation((url) => {
      expect(url).toBe(`users/1`)
      return Promise.resolve({ data: { id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }})
    })

    const user = await User.id(1).get()

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe('1')
    expect(user.name).toBe('Cedric')
  })

  it('can use the static include method', async () => {
    vi.spyOn(Fluentity, 'call').mockImplementation((url) => {
      expect(url).toBe(`users?include=medias`)
      expect(url.includes('include=medias')).toBeTruthy()
      return Promise.resolve({ data: [
        { id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }
      ]})
    })

    const users = await User.include('medias').all()

    expect(users).toBeInstanceOf(Array)
    expect(users).toHaveLength(1)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].name).toBe('Cedric')
  })

  it('can use the filter method', async () => {
    vi.spyOn(Fluentity, 'call').mockImplementation((url) => {
      expect(url).toBe(`users?name=Cedric`)
      expect(url.includes('name=Cedric')).toBeTruthy()
      return Promise.resolve({ data: [
        { id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }
      ]})
    })

    const users = await User.filter({ name: 'Cedric' }).all()

    expect(users).toBeInstanceOf(Array)
    expect(users).toHaveLength(1)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].name).toBe('Cedric')
  })

  it('can use the include method', async () => {
    vi.spyOn(Fluentity, 'call').mockImplementation((url) => {
      expect(url).toBe(`users?name=Cedric&include=medias`)
      expect(url.includes('name=Cedric')).toBeTruthy()
      expect(url.includes('include=medias')).toBeTruthy()
      return Promise.resolve({ data: [
        { id: '1', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 }
      ]})
    })

    const users = await User.filter({ name: 'Cedric' }).include('medias').all()

    expect(users).toBeInstanceOf(Array)
    expect(users).toHaveLength(1)
    expect(users[0]).toBeInstanceOf(User)
    expect(users[0].name).toBe('Cedric')
  })

  
})