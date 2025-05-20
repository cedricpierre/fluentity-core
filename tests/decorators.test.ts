import { describe, it, expect, vi, beforeEach } from 'vitest'
import { User } from '../examples/models/User'
import { FluORM, HttpClient } from '../src/index'
import { Media } from '../examples/models/Media'
import { Thumbnail } from '../examples/models/Thumbnail'

const baseUrl = 'http://localhost:3000'
FluORM.configure({
  baseUrl
})

describe('Models', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  
  it('should be able to get medias from a user', async () => {

    vi.spyOn(HttpClient, 'call').mockResolvedValue([
        { id: 1, name: 'Media 1' },
        { id: 2, name: 'Media 2' },
      ])

    const media = await User.id(1).medias.all()
    expect(media).toBeInstanceOf(Array)
    expect(media).toHaveLength(2)
    expect(media[0]).toBeInstanceOf(Media)
  })
  
  it('should be able to get libraries (custom name) from a user', async () => {

    vi.spyOn(HttpClient, 'call')
    .mockImplementation((url) => {
      
      expect(url).toBe('users/1/medias')
      
      return Promise.resolve([
        { id: 1, name: 'Media 1' },
        { id: 2, name: 'Media 2' },
      ])
    });

    const media = await User.id(1).libraries.all()
    expect(media).toBeInstanceOf(Array)
    expect(media).toHaveLength(2)
    expect(media[0]).toBeInstanceOf(Media)
  })

  it('should be able to cast thumbnail', async () => {
    vi.spyOn(HttpClient, 'call').mockResolvedValue({
      id: 1,
      thumbnail: {
        id: 1,
        url: 'https://example.com/thumbnail.jpg',
        width: 100,
        height: 100,
      }
    })

    const user = await User.find(1)
    expect(user.thumbnail).toBeInstanceOf(Thumbnail)
    expect(user.thumbnail.url).toBe('https://example.com/thumbnail.jpg')
  })

  it('can create a new instance of a model', async () => {
    const user = new User({ name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 })
    
    expect(user).toBeDefined()

    user.thumbnail = new Thumbnail({ id: 1, url: 'https://example.com/thumbnail.jpg' })
    expect(user.thumbnail).toBeInstanceOf(Thumbnail)
  })
  
  it('should construct correct path with custom resource name', async () => {
    vi.spyOn(HttpClient, 'call')
      .mockImplementation((url) => {
        expect(url).toBe('users/1/custom-resource')
        return Promise.resolve([])
      });

    const result = await User.id(1).customResource.all()
    expect(result).toBeInstanceOf(Array)
  })

  it('should construct correct path with default resource name', async () => {
    vi.spyOn(HttpClient, 'call')
      .mockImplementation((url) => {
        expect(url).toBe('users/1/medias')
        return Promise.resolve([])
      });

    const result = await User.id(1).medias.all()
    expect(result).toBeInstanceOf(Array)
  })

  it('should handle nested paths correctly', async () => {
    vi.spyOn(HttpClient, 'call')
      .mockImplementation((url) => {
        expect(url).toBe('users/1/medias/2/thumbnails')
        return Promise.resolve([])
      });

    const result = await User.id(1).medias.id(2).thumbnails.all()
    expect(result).toBeInstanceOf(Array)
  })

  it('should handle empty path correctly', async () => {
    vi.spyOn(HttpClient, 'call')
      .mockImplementation((url) => {
        expect(url).toBe('users/1')
        return Promise.resolve({})
      });

    const result = await User.id(1).get()
    expect(result).toBeDefined()
  })
})