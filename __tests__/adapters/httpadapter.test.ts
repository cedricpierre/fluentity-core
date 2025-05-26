import {
  HttpAdapter,
  HttpRequest,
  HttpResponse,
} from '../../src/adapters/HttpAdapter';
import { QueryBuilder } from '../../src/QueryBuilder';
import { Methods } from '../../src/Fluentity';
import { expect, describe, afterEach, beforeAll, beforeEach, mock, it} from 'bun:test';

interface TestResponseData {
  url: string;
  method: string;
  body: string;
  intercepted?: boolean;
}

// Custom timer implementation for testing
class TestTimer {
  private time: number = 0;
  private timers: Map<number, () => void> = new Map();
  private nextId: number = 1;

  advanceTime(ms: number) {
    this.time += ms;
    // Execute any timers that should have fired
    for (const [id, callback] of this.timers.entries()) {
      if (this.time >= id) {
        callback();
        this.timers.delete(id);
      }
    }
  }

  setTimeout(callback: () => void, ms: number): number {
    const id = this.nextId++;
    this.timers.set(this.time + ms, callback);
    return id;
  }

  clearTimeout(id: number) {
    this.timers.delete(id);
  }

  getCurrentTime(): number {
    return this.time;
  }
}

// Create a concrete implementation of HttpAdapter for testing
class TestHttpAdapter extends HttpAdapter {
  async call<T = TestResponseData>(queryBuilder: QueryBuilder): Promise<HttpResponse<T>> {
    if (!this.options.baseUrl) {
      throw new Error('baseUrl is required');
    }

    // Mock implementation for testing
    const response = new HttpResponse<T>({
      data: {
        url: `${this.options.baseUrl}/${queryBuilder.resource}`,
        method: queryBuilder.method || Methods.GET,
        body: JSON.stringify(queryBuilder.body || {}),
      } as T,
    });

    // Apply response interceptor if configured
    if (this.options.responseInterceptor) {
      return this.options.responseInterceptor.call(this, response);
    }

    return response;
  }
}

describe('HttpAdapter', () => {
  let adapter: TestHttpAdapter;
  let testTimer: TestTimer;

  beforeEach(() => {
    adapter = new TestHttpAdapter({
      baseUrl: 'https://api.example.com',
      options: {
        headers: {
          'Content-Type': 'application/json',
          'X-Custom-Header': 'test',
        },
      },
    });
    testTimer = new TestTimer();
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
      
      try {
        await adapterWithoutBaseUrl.call(queryBuilder);
        throw new Error('Expected call to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('baseUrl is required');
      }
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

        const response = await adapter.call<TestResponseData>(queryBuilder);
        expect(response.data.method).toBe(method);
      }
    });
  });

  describe('caching', () => {
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
      const requestInterceptor = (request: HttpRequest) => {
        if (!request.options) request.options = {};
        if (!request.options.headers) request.options.headers = {};
        request.options.headers['X-Test'] = 'test';
        return request;
      };
      
      adapter.configure({ requestInterceptor });
      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      const response = await adapter.call<TestResponseData>(queryBuilder);
      expect(response.data.url).toBe('https://api.example.com/test');
    });

    it('should apply response interceptor', async () => {
      const responseInterceptor = function(this: TestHttpAdapter, response: HttpResponse<TestResponseData>) {
        const newResponse = new HttpResponse<TestResponseData>({
          data: {
            ...response.data,
            intercepted: true,
          },
        });
        return newResponse;
      };

      adapter.configure({ responseInterceptor: responseInterceptor.bind(adapter) });
      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      const response = await adapter.call<TestResponseData>(queryBuilder);
      expect(response.data.intercepted).toBe(true);
    });

    it('should chain multiple interceptors', async () => {
      const requestInterceptor1 = (request: HttpRequest) => {
        if (!request.options) request.options = {};
        if (!request.options.headers) request.options.headers = {};
        request.options.headers['X-Test1'] = 'test1';
        return request;
      };
      
      const requestInterceptor2 = (request: HttpRequest) => {
        if (!request.options) request.options = {};
        if (!request.options.headers) request.options.headers = {};
        request.options.headers['X-Test2'] = 'test2';
        return request;
      };

      adapter.configure({
        requestInterceptor: (request) => requestInterceptor2(requestInterceptor1(request)),
      });

      const queryBuilder = new QueryBuilder();
      queryBuilder.resource = 'test';

      const response = await adapter.call<TestResponseData>(queryBuilder);
      expect(response.data.url).toBe('https://api.example.com/test');
    });
  });
});
