import { expect, describe, it, beforeEach, mock, spyOn, beforeAll } from 'bun:test'
import { Fluentity } from '../src/index'
import { User } from '../examples/models/User'
import { Media } from '../examples/models/Media'

const user: User = new User({ id: '123', name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 })

let fluentity: Fluentity;
beforeAll(() => {
  Fluentity.reset();
  fluentity = Fluentity.initialize()
});


describe('Models', () => {
  
  beforeEach(() => {
    mock.restore()
  })

  it('can save a user', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: { id: '123', name: 'Cedric created' } })

    await user.save()

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe('123')
    expect(user.name).toBe('Cedric created')
  })

  it('can set the id of an instance and fetch the instance', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: { id: '123', name: 'Cedric' } })

    const user = await User.id(123).get()

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe('123')
  })

  it('can update an instance of a user', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: { id: '123', name: 'Cedric updated' } })

    await user.update({ name: 'Cedric updated' })

    expect(user.name).toBe('Cedric updated')
  })

  it('can delete an instance of a user', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

    await user.delete()
  })

  it('can have a relation HasOne', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: { id: '123', url: 'https://example.com/thumbnail.jpg' } })

    const picture = await user.picture.get()

    expect(picture).toBeInstanceOf(Media)
    expect(picture.id).toBe('123')
    expect(picture.url).toBe('https://example.com/thumbnail.jpg')
  })

  it('can update a relation HasOne', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: { id: '123', url: 'https://example.com/thumbnail-updated.jpg' } })

    const picture = await user.picture.update({ url: 'https://example.com/thumbnail-updated.jpg' })

    expect(picture).toBeInstanceOf(Media)
    expect(picture.id).toBe('123')
    expect(picture.url).toBe('https://example.com/thumbnail-updated.jpg')
  })

  it('can delete a relation HasOne', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

    await user.picture.delete()
  })

  it('can have a relation HasMany', async () => {

    spyOn(fluentity.adapter, 'call').mockResolvedValue({ 
      data: [
        { id: '1', name: 'Photo 1', url: 'https://example.com/photo1.jpg' },
        { id: '2', name: 'Photo 2', url: 'https://example.com/photo2.jpg' }
      ]
    })

    const medias = await user.medias.all()

    expect(medias).toBeInstanceOf(Array)
    expect(medias).toHaveLength(2)
    expect(medias.every((media: Media) => media instanceof Media)).toBe(true)
  })
})