import { RestAdapter } from '../../src/adapters/RestAdapter'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DefaultAdapter } from '../../src/adapters/DefaultAdapter'
import { User } from '../../examples/models/User'
import { Methods } from '../../src/Fluentity'

const defaultAdapter = new DefaultAdapter()

describe('DefaultAdapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should make a request', async () => {
    const response = await defaultAdapter.call({ url: 'https://api.example.com' })
    expect(response).toBeDefined()
  })

  it('should configure the adapter', async () => {
    defaultAdapter.configure({ baseUrl: 'https://api.example.com' })
    const response = await defaultAdapter.call({ url: 'https://api.example.com' })
    expect(response).toBeDefined()
  })
})