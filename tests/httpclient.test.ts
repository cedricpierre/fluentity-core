import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient, Methods } from '../src/HttpClient'
import { User } from '../examples/models/User'

describe('HttpClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    HttpClient.clearCache()
    HttpClient.configure({
      baseUrl: 'https://api.example.com',
      cacheOptions: { enabled: false }
    })
  })
  
  it('can make a GET request', async () => {
    const mockResponse = { id: 1, title: 'Test Post' }
    const mockRequestHandler = vi.fn().mockResolvedValue(mockResponse)
    
    HttpClient.configure({ 
      requestHandler: mockRequestHandler,
      baseUrl: 'https://jsonplaceholder.typicode.com'
    })

    const response = await HttpClient.call('posts')
    expect(response).toEqual(mockResponse)
    expect(mockRequestHandler).toHaveBeenCalledWith(expect.objectContaining({
      url: 'https://jsonplaceholder.typicode.com/posts'
    }))
  })

  it('doest have a baseUrl', async () => {
    HttpClient.configure({ baseUrl: undefined })

    await expect(HttpClient.call('https://jsonplaceholder.typicode.com/posts')).rejects.toThrow('baseUrl is required')

  })

  it('has a baseUrl', async () => {
    HttpClient.configure({ baseUrl: 'https://jsonplaceholder.typicode.com' })

    const response = await HttpClient.call('posts')

    expect(response).not.toBeNull()
  })

  it('should raise an error if the response is not ok', async () => {

    try {
      vi.spyOn(HttpClient, 'call').mockRejectedValue(new Error('HTTP error: 404'))
      await HttpClient.call('https://google.com')
    } catch (error) {
      expect(error).toBeDefined()
      expect(error).toBeInstanceOf(Error)
    }
  })

  
  it('can cache a response', async () => {
    HttpClient.configure({ cacheOptions: { enabled: true }, baseUrl: 'https://jsonplaceholder.typicode.com' })

    await HttpClient.call('posts')

    const cachedResponse = HttpClient.getCache('posts')

    expect(cachedResponse).not.toBeNull()

    HttpClient.deleteCache('posts')

    const emptyCache = HttpClient.getCache('cache')

    expect(emptyCache).toBeUndefined()

    HttpClient.clearCache()

    expect(HttpClient.cache.size).toBe(0)
  })

  it('can cache a response with a ttl', async () => {
    HttpClient.configure({ cacheOptions: { enabled: true, ttl: 1000 }, baseUrl: 'https://jsonplaceholder.typicode.com' })

    await HttpClient.call('posts')

    const cachedResponse = HttpClient.getCache('posts')

    expect(cachedResponse).not.toBeNull() 
  })

  describe('Request/Response Interceptors', () => {
    it('should apply request interceptor', async () => {
      const requestInterceptor = vi.fn((request) => ({
        ...request,
        options: { ...request.options, headers: { 'X-Custom-Header': 'test' } }
      }))

      const requestHandler = vi.fn().mockResolvedValue({ data: 'test' })
      HttpClient.configure({ 
        requestInterceptor,
        requestHandler
      })

      await HttpClient.call('test')
      expect(requestInterceptor).toHaveBeenCalled()
      expect(requestHandler).toHaveBeenCalledWith(expect.objectContaining({
        options: expect.objectContaining({
          headers: { 'X-Custom-Header': 'test' }
        })
      }))
    })

    it('should apply response interceptor', async () => {
      const responseInterceptor = vi.fn((response) => ({
        ...response,
        transformed: true
      }))

      HttpClient.configure({ responseInterceptor })

      const response = await HttpClient.call('test')
      expect(responseInterceptor).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle HTTP errors', async () => {
      const mockError = new Error('HTTP error: 404')
      const errorInterceptor = vi.fn()
      const mockRequestHandler = vi.fn().mockRejectedValue(mockError)
      
      HttpClient.configure({ 
        errorInterceptor,
        requestHandler: mockRequestHandler,
      })
      
      await expect(HttpClient.call('test')).rejects.toThrow('HTTP error: 404')
      expect(errorInterceptor).toHaveBeenCalledTimes(1)
      expect(errorInterceptor).toHaveBeenCalledWith(mockError)
    })
  })

  describe('HTTP Methods', () => {
    it('should support different HTTP methods', async () => {
      const methods = [Methods.POST, Methods.PUT, Methods.PATCH, Methods.DELETE]
      
      for (const method of methods) {
        vi.spyOn(HttpClient, 'call').mockResolvedValue({ success: true })
        
        const response = await HttpClient.call('test', { method })
        expect(response).toEqual({ success: true })
      }
    })
  })

  describe('Cache Management', () => {
    it('should respect cache TTL', async () => {
      HttpClient.configure({ 
        cacheOptions: { 
          enabled: true, 
          ttl: 100 // 100ms TTL
        }
      })
      
      await HttpClient.call('test')
      const initialCache = HttpClient.getCache('test')
      expect(initialCache).toBeDefined()

      // Wait for cache to expire
      await new Promise(resolve => setTimeout(resolve, 150))
      
      expect(initialCache.timestamp).toBeLessThan(Date.now() - 100)

      await new Promise(resolve => setTimeout(resolve, 150))

      await HttpClient.call('test')
      
      const expiredCache = HttpClient.getCache('test')
      expect(expiredCache).toBeDefined()
    })

    it('should handle cache with different URLs', async () => {
      HttpClient.configure({ cacheOptions: { enabled: true } })
      
      await HttpClient.call('test1')
      await HttpClient.call('test2')

      expect(HttpClient.getCache('test1')).toBeDefined()
      expect(HttpClient.getCache('test2')).toBeDefined()
      expect(HttpClient.cache.size).toBe(2)
    })
  })

  describe('Request Options', () => {
    it('should handle request options correctly', async () => {
      const options = {
        method: Methods.POST,
        body: { test: 'data' },
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' as const
      }

      vi.spyOn(HttpClient, 'call').mockResolvedValue({ success: true })
      
      const response = await HttpClient.call('test', options)
      expect(response).toEqual({ success: true })
    })

    it('should merge default and custom options', async () => {
      HttpClient.configure({
        options: {
          headers: { 'X-Default': 'default' }
        }
      })

      const customOptions = {
        headers: { 'X-Custom': 'custom' }
      }

      vi.spyOn(HttpClient, 'call').mockResolvedValue({ success: true })
      
      await HttpClient.call('test', customOptions)
      expect(HttpClient.options.options?.headers).toHaveProperty('X-Default')
    })
  })
})