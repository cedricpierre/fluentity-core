import {
  HttpAdapter,
  HttpRequest,
  HttpResponse,
  HttpAdapterOptions,
} from '../../src/adapters/HttpAdapter';
import { QueryBuilder } from '../../src/QueryBuilder';
import { Methods } from '../../src/Fluentity';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

interface TestResponseData {
  url: string;
  method: string;
  body: string;
}

// Create a concrete implementation of HttpAdapter for testing
class TestHttpAdapter extends HttpAdapter {
  protected buildUrl(queryBuilder: QueryBuilder): string {
    return queryBuilder.resource || '';
  }

  protected async fetchRequestHandler(
    request: HttpRequest
  ): Promise<HttpResponse<TestResponseData>> {
    return new HttpResponse<TestResponseData>({
      data: {
        url: request.url,
        method: request.method || '',
        body: request.body || '',
      },
    });
  }
}

describe('HttpAdapter', () => {
  let adapter: TestHttpAdapter;
  const baseOptions: Partial<HttpAdapterOptions> = {
    baseUrl: 'https://api.example.com',
    options: {
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'test',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new TestHttpAdapter(baseOptions);
  });

  describe('configuration', () => {
    it('should initialize with default options', () => {
      const defaultAdapter = new TestHttpAdapter({});
      expect(defaultAdapter.options).toMatchObject({
        baseUrl: '',
        options: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
        cacheOptions: {
          enabled: false,
          ttl: 5 * 60 * 1000,
        },
      });
    });

    it('should merge provided options with defaults', () => {
      expect(adapter.options).toMatchObject({
        baseUrl: 'https://api.example.com',
        options: {
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'test',
          },
        },
      });
    });

    it('should allow reconfiguration', () => {
      adapter.configure({ baseUrl: 'https://new-api.example.com' });
      expect(adapter.options.baseUrl).toBe('https://new-api.example.com');
    });
  });

  describe('request handling', () => {
    it('should throw error if baseUrl is not configured', async () => {
      const adapterWithoutBaseUrl = new TestHttpAdapter({});
      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      await expect(adapterWithoutBaseUrl.call(queryBuilder)).rejects.toThrow('baseUrl is required');
    });

    it('should make successful request with correct parameters', async () => {
      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'users';
      queryBuilder.method = Methods.GET;
      queryBuilder.body = { name: 'test' };

      const response = await adapter.call(queryBuilder);
      expect(response).toBeDefined();
    });

    it('should handle different HTTP methods', async () => {
      const methods = [Methods.GET, Methods.POST, Methods.PUT, Methods.PATCH, Methods.DELETE];

      for (const method of methods) {
        const queryBuilder = new QueryBuilder();
        queryBuilder.resource = 'test';
        queryBuilder.method = method;
        queryBuilder.body = { data: 'test' };

        const response = (await adapter.call(queryBuilder)) as HttpResponse<TestResponseData>;
        expect(response.data.method).toBe(method);
      }
    });
  });

  describe('caching', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should not cache responses when caching is disabled', async () => {
      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      const response1 = await adapter.call(queryBuilder);
      const response2 = await adapter.call(queryBuilder);

      expect(response1).not.toBe(response2);
    });

    it('should cache responses when caching is enabled', async () => {
      adapter.configure({
        cacheOptions: {
          enabled: true,
          ttl: 1000,
        },
      });

      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      const response1 = await adapter.call(queryBuilder);
      const response2 = await adapter.call(queryBuilder);

      expect(response1).toStrictEqual(response2);
    });

    it('should expire cached responses after TTL', async () => {
      adapter.configure({
        cacheOptions: {
          enabled: true,
          ttl: 1000,
        },
      });

      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      const response1 = await adapter.call(queryBuilder);

      // Advance time by 1.5 seconds (past TTL)
      vi.advanceTimersByTime(1500);

      const response2 = await adapter.call(queryBuilder);
      expect(response1).not.toBe(response2);
    });

    it('should clear cache when clearCache is called', async () => {
      adapter.configure({
        cacheOptions: {
          enabled: true,
          ttl: 1000,
        },
      });

      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      const response1 = await adapter.call(queryBuilder);
      adapter.clearCache();
      const response2 = await adapter.call(queryBuilder);

      expect(response1).not.toBe(response2);
    });
  });

  describe('interceptors', () => {
    it('should apply request interceptor', async () => {
      const requestInterceptor = vi.fn((request: HttpRequest) => {
        if (request.options?.headers) {
          request.options.headers = {
            ...request.options.headers,
            'X-Intercepted': 'true',
          };
        }
        return request;
      });

      adapter.configure({ requestInterceptor });

      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      await adapter.call(queryBuilder);
      expect(requestInterceptor).toHaveBeenCalledTimes(1);
      expect(requestInterceptor.mock.calls[0][0]).toMatchObject({
        url: 'test',
        options: {
          headers: expect.objectContaining({
            'X-Intercepted': 'true',
          }),
        },
      });
    });

    it('should apply response interceptor', async () => {
      const responseInterceptor = vi.fn((response: HttpResponse<TestResponseData>) => {
        response.data = { ...response.data, intercepted: true } as TestResponseData & {
          intercepted: boolean;
        };
        return response;
      });

      adapter.configure({ responseInterceptor });

      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      const response = await adapter.call(queryBuilder);
      expect(responseInterceptor).toHaveBeenCalledTimes(1);
      expect(response.data).toHaveProperty('intercepted', true);
    });

    it('should chain multiple interceptors', async () => {
      const requestInterceptor1 = vi.fn((request: HttpRequest) => {
        if (request.options?.headers) {
          request.options.headers['X-Interceptor-1'] = 'true';
        }
        return request;
      });

      const requestInterceptor2 = vi.fn((request: HttpRequest) => {
        if (request.options?.headers) {
          request.options.headers['X-Interceptor-2'] = 'true';
        }
        return request;
      });

      adapter.configure({ requestInterceptor: requestInterceptor1 });
      adapter.configure({ requestInterceptor: requestInterceptor2 });

      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      await adapter.call(queryBuilder);
      expect(requestInterceptor1).not.toHaveBeenCalled();
      expect(requestInterceptor2).toHaveBeenCalledTimes(1);
      expect(requestInterceptor2.mock.calls[0][0].options?.headers).toMatchObject({
        'X-Interceptor-2': 'true',
      });
    });
  });
});
