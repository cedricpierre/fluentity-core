import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Fluentity, HttpClient, HttpRequest, HttpResponse, Methods } from '../src/index'

const fluentity = Fluentity.initialize({
    adapter: new HttpClient({
        baseUrl: '',
    })
})

describe('Fluentity Class', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it('has an adapter', () => {
        expect(fluentity.adapter).toBeDefined()
    })

    it('can get the instance', () => {
        expect(fluentity).toBeDefined()
    })

    it('has static instance', () => {
        expect(Fluentity.getInstance()).toBeDefined()
    })

    it('should have a default adapter', () => {
        expect(fluentity.adapter).toBeDefined()
    })


    it('can configure the base URL', () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

        fluentity.adapter.configure({ baseUrl: 'https://api.example.com' })
        expect(fluentity.adapter.options.baseUrl).toBe('https://api.example.com')
    })

    it('can configure the request interceptor', () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })
        
        const interceptor = (request: HttpRequest) => {
            return request
        }

        fluentity.adapter.configure({ requestInterceptor: interceptor })
        expect(fluentity.adapter.options.requestInterceptor).toBe(interceptor)
    })

    it('can configure the response interceptor', () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

        const interceptor = (response: HttpResponse) => {
            return response
        }

        fluentity.adapter.configure({ responseInterceptor: interceptor })
        expect(fluentity.adapter.options.responseInterceptor).toBe(interceptor)
    })

    it('can configure the request handler', async () => {
    
        const handler = (request: HttpRequest) => {
            expect(request.url).toBe('https://api.example.com/users')
            expect(request.options).toBeDefined()
            expect(request.options?.method).toBe('GET')
            return Promise.resolve<HttpResponse>({ data: true })
        }
        
        fluentity.adapter.configure({ requestHandler: handler })
        const response = await fluentity.adapter.call({ url: 'users', method: Methods.GET })
        expect(response).toBeDefined()
        expect(response.data).toBe(true)
        expect(fluentity.adapter.options.requestHandler).toBe(handler)
    })

    it('can configure the error interceptor', () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

        const interceptor = vi.fn()
        fluentity.adapter.configure({ errorInterceptor: interceptor })
        expect(fluentity.adapter.options.errorInterceptor).toBe(interceptor)
    })

    it('can call a GET request', async () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

        const response = await fluentity.adapter.call({ url: 'users' })
        expect(response).toBeDefined()
        expect(response.data).toBe(true)
    })
    
    it('can call a POST request', async () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

        const response = await fluentity.adapter.call({ url: 'users', method: 'POST' })
        expect(response).toBeDefined()
    })

    it('can call a PUT request', async () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

        const response = await fluentity.adapter.call({ url: 'users', method: 'PUT' })
        expect(response).toBeDefined()
    })  


    it('can call a PATCH request', async () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

        const response = await fluentity.adapter.call({ url: 'users', method: 'PATCH' })
        expect(response).toBeDefined()
    })  

    it('can call a DELETE request', async () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

        const response = await fluentity.adapter.call({ url: 'users', method: 'DELETE' })
        expect(response).toBeDefined()
    })  

    it('can call a HEAD request', async () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

        const response = await fluentity.adapter.call({ url: 'users', method: 'HEAD' })
        expect(response).toBeDefined()
    })    

    it('can call a OPTIONS request', async () => {
        vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true })

        const response = await fluentity.adapter.call({ url: 'users', method: 'OPTIONS' })
        expect(response).toBeDefined()
    })

    it('can use a custom request handler', async () => {
        fluentity.adapter.configure({
            baseUrl: 'https://jsonplaceholder.typicode.com',
            requestHandler: async (request) => {
                
                return {id: 1, name: 'John Doe'}
            }
        });

        const response = await fluentity.adapter.call({ url: 'users' })
        expect(response).toBeDefined()
        expect(response.id).toBe(1)
        expect(response.name).toBe('John Doe')
    })
    
})
