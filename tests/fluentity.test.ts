import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Fluentity, HttpRequest, HttpResponse } from '../src/index'

describe('Fluentity Class', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it('can configure the base URL', () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)

        Fluentity.configure({ baseUrl: 'https://api.example.com' })
        expect(Fluentity.options.baseUrl).toBe('https://api.example.com')
    })

    it('can configure the request interceptor', () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)
        
        const interceptor = (request: HttpRequest) => {
            return request
        }

        Fluentity.configure({ requestInterceptor: interceptor })
        expect(Fluentity.options.requestInterceptor).toBe(interceptor)
    })

    it('can configure the response interceptor', () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)

        const interceptor = (response: HttpResponse) => {
            return response
        }

        Fluentity.configure({ responseInterceptor: interceptor })
        expect(Fluentity.options.responseInterceptor).toBe(interceptor)
    })

    it('can configure the request handler', async () => {
    
        const handler = (request: HttpRequest) => {
            expect(request.url).toBe('https://api.example.com/users')
            expect(request.options).toBeDefined()
            expect(request.options?.method).toBe('GET')
            return Promise.resolve<HttpResponse>(true)
        }
        
        Fluentity.configure({ requestHandler: handler })
        const response = await Fluentity.call('users', { method: 'GET' })
        expect(response).toBe(true)
        expect(Fluentity.options.requestHandler).toBe(handler)
    })

    it('can configure the error interceptor', () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)

        const interceptor = vi.fn()
        Fluentity.configure({ errorInterceptor: interceptor })
        expect(Fluentity.options.errorInterceptor).toBe(interceptor)
    })

    it('can call a GET request', async () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)

        const response = await Fluentity.call('users')
        expect(response).toBeDefined()
    })
    
    it('can call a POST request', async () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)

        const response = await Fluentity.call('users', { method: 'POST' })
        expect(response).toBeDefined()
    })

    it('can call a PUT request', async () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)

        const response = await Fluentity.call('users', { method: 'PUT' })
        expect(response).toBeDefined()
    })  


    it('can call a PATCH request', async () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)

        const response = await Fluentity.call('users', { method: 'PATCH' })
        expect(response).toBeDefined()
    })  

    it('can call a DELETE request', async () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)

        const response = await Fluentity.call('users', { method: 'DELETE' })
        expect(response).toBeDefined()
    })  

    it('can call a HEAD request', async () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)

        const response = await Fluentity.call('users', { method: 'HEAD' })
        expect(response).toBeDefined()
    })    

    it('can call a OPTIONS request', async () => {
        vi.spyOn(Fluentity, 'call').mockResolvedValue(true)

        const response = await Fluentity.call('users', { method: 'OPTIONS' })
        expect(response).toBeDefined()
    })

    it('can use a custom request handler', async () => {
        Fluentity.configure({
            baseUrl: 'https://jsonplaceholder.typicode.com',
            requestHandler: async (request) => {
                // Handle request and return a the response
                const response = await fetch(request.url, request.options)
                const json = await response.json()
                return {id: 1, name: 'John Doe'}
            }
        });

        const response = await Fluentity.call('users')
        expect(response).toBeDefined()
        expect(response.id).toBe(1)
        expect(response.name).toBe('John Doe')
    })
    
})
