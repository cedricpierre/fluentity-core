import { RestAdapter } from '../../src/adapters/RestAdapter';
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { QueryBuilder } from '../../src/QueryBuilder';
import { HttpResponse, HttpRequest, Methods } from '../../src/adapters/HttpAdapter';
import { User } from '../../examples/models/User';
import { Model } from '../../src/Model';

interface TestResponseData {
  success?: boolean;
  method?: string;
  id?: number;
  title?: string;
  intercepted?: boolean;
}

describe('RestAdapter', () => {
  let httpClient: RestAdapter;

  beforeEach(() => {
    httpClient = new RestAdapter({ baseUrl: 'https://jsonplaceholder.typicode.com' });
    httpClient.clearCache();
    mock.restore();
  });

  describe('Request/Response Interceptors', () => {
    it('should apply request interceptor', async () => {
      const requestInterceptor = (request: HttpRequest) => {
        if (!request.options) request.options = {};
        if (!request.options.headers) request.options.headers = {};
        request.options.headers['X-Test'] = 'test';
        return request;
      };

      const requestHandler = async (request: HttpRequest) => {
        return new HttpResponse<TestResponseData>({ data: { success: true } });
      };

      httpClient.configure({
        requestInterceptor,
        requestHandler,
      });

      await httpClient.call(new QueryBuilder({ model: User as typeof Model, }));
    });

    it('should apply response interceptor', async () => {
      const responseInterceptor = (response: HttpResponse<TestResponseData>) => {
        response.data = { ...response.data, intercepted: true };
        return response;
      };

      const mockResponse = new HttpResponse<TestResponseData>({ data: { success: true } });
      const requestHandler = async (request: HttpRequest) => mockResponse;

      httpClient.configure({
        responseInterceptor,
        requestHandler,
      });

      const response = await httpClient.call(new QueryBuilder({ model: User as typeof Model, }));
      expect(response.data).toHaveProperty('intercepted', true);
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors', async () => {
      const errorInterceptor = (error: Error) => {
        throw error;
      };

      const mockError = new Error('HTTP error: 404');
      const requestHandler = async (request: HttpRequest) => {
        throw mockError;
      };

      httpClient.configure({
        errorInterceptor,
        requestHandler,
      });

      await expect(httpClient.call(new QueryBuilder({ model: User as typeof Model, }))).rejects.toThrow(
        'HTTP error: 404'
      );
    });
  });

  describe('HTTP Methods', () => {
    it('should support different HTTP methods', async () => {
      const methods = [Methods.GET, Methods.POST, Methods.PUT, Methods.PATCH, Methods.DELETE];
      const requestHandler = async (request: HttpRequest) => {
        return new HttpResponse<TestResponseData>({ data: { method: request.method } });
      };

      httpClient.configure({ requestHandler });

      for (const method of methods) {
        const queryBuilder = new QueryBuilder({ model: User as typeof Model, method });
        const response = await httpClient.call(queryBuilder) as HttpResponse<TestResponseData>;
        expect(response.data.method).toBe(method);
      }
    });
  });

  describe('Request Options', () => {
    it('should handle request options correctly', async () => {
      const requestHandler = async (request: HttpRequest) => {
        return new HttpResponse<TestResponseData>({ data: { success: true } });
      };

      httpClient.configure({ requestHandler });

      const response = await httpClient.call(
        new QueryBuilder({ model: User as typeof Model, method: Methods.POST, body: { test: 'data' } })
      ) as HttpResponse<TestResponseData>;
      expect(response.data.success).toBe(true);
    });

    it('should merge default and custom options', async () => {
      httpClient.configure({
        options: {
          headers: { 'X-Default': 'default' },
        },
      });

      const requestHandler = async (request: HttpRequest) => {
        return new HttpResponse<TestResponseData>({ data: { success: true } });
      };

      httpClient.configure({ requestHandler });

      await httpClient.call(
        new QueryBuilder({ model: User as typeof Model, method: Methods.POST, body: { test: 'data' } })
      );
      expect(httpClient.options.options?.headers).toHaveProperty('X-Default');
    });
  });

  it('can make a GET request', async () => {
    const mockResponse = new HttpResponse<TestResponseData>({ 
      data: { id: 1, title: 'Test Post' } 
    });
    const requestHandler = async (request: HttpRequest) => mockResponse;

    httpClient.configure({
      requestHandler,
      baseUrl: 'https://jsonplaceholder.typicode.com',
    });

    const response = await httpClient.call(new QueryBuilder({ model: User as typeof Model, }));
    expect(response).toEqual(mockResponse);
  });

  it('should throw error if baseUrl is not configured', async () => {
    httpClient.configure({ baseUrl: undefined });

    await expect(httpClient.call(new QueryBuilder({ model: User as typeof Model, }))).rejects.toThrow(
      'baseUrl is required'
    );
  });

  it('should raise an error if the response is not ok', async () => {
    const requestHandler = async (request: HttpRequest) => {
      throw new Error('HTTP error: 404');
    };

    httpClient.configure({ requestHandler });

    await expect(httpClient.call(new QueryBuilder({ model: User as typeof Model, }))).rejects.toThrow(
      'HTTP error: 404'
    );
  });
});
