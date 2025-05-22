import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '../../src/adapters/HttpClient'
import { User } from '../../examples/models/User'
import { Methods } from '../../src/Fluentity'
import { DefaultClient } from '../../src/adapters/DefaultClient'

const defaultClient = new DefaultClient()

describe('DefaultClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should be able to call the default client', async () => {
    const response = await defaultClient.call({ url: 'https://api.example.com' })
    expect(response).toEqual({ data: {} })
  })

  it('should be able to configure the default client', async () => {
    defaultClient.configure({ baseUrl: 'https://api.example.com' })
    const response = await defaultClient.call({ url: 'https://api.example.com' })
    expect(response).toEqual({ data: {} })
  })
})