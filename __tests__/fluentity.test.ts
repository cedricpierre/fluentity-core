import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Fluentity, RestAdapter, Methods } from '../src/index';
import { QueryBuilder } from '../src/QueryBuilder';
import { User } from '../examples/models/User';
import { HttpResponse, HttpRequest } from '../src/adapters/HttpAdapter';

describe('Fluentity Class', () => {
  let fluentity: Fluentity;

  beforeEach(() => {
    // Reset the singleton instance before each test
    // @ts-ignore - accessing private static property for testing
    Fluentity.instance = undefined;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    // @ts-ignore - accessing private static property for testing
    Fluentity.instance = undefined;
  });

  describe('Initialization and Instance Management', () => {
    it('should throw an error if getting instance before initialization', () => {
      expect(() => Fluentity.getInstance()).toThrow(
        'Fluentity has not been initialized. Call initialize() first.'
      );
    });

    it('can initialize with custom adapter', () => {
      fluentity = Fluentity.initialize({
        adapter: new RestAdapter({
          baseUrl: '',
        }),
      });
      expect(fluentity).toBeDefined();
    });

    it('should throw an error if trying to initialize twice', () => {
      Fluentity.initialize();
      expect(() => Fluentity.initialize()).toThrow(
        'Fluentity has already been initialized. Use getInstance() instead.'
      );
    });

    it('can get the instance after initialization', () => {
      fluentity = Fluentity.initialize();
      expect(Fluentity.getInstance()).toBeDefined();
      expect(Fluentity.getInstance()).toBe(fluentity);
    });

    it('should have a default adapter if none provided', () => {
      fluentity = Fluentity.initialize();
      expect(fluentity.adapter).toBeDefined();
    });
  });

  describe('Adapter Configuration', () => {
    beforeEach(() => {
      fluentity = Fluentity.initialize({
        adapter: new RestAdapter({
          baseUrl: '',
        }),
      });
    });

    it('can configure the base URL', () => {
      vi.spyOn(fluentity.adapter, 'call').mockResolvedValue({ data: true });
      fluentity.adapter.configure({ baseUrl: 'https://api.example.com' });
      expect(fluentity.adapter.options.baseUrl).toBe('https://api.example.com');
    });

    it('can configure the request interceptor', () => {
      const interceptor = (request: HttpRequest) => request;
      fluentity.adapter.configure({ requestInterceptor: interceptor });
      expect(fluentity.adapter.options.requestInterceptor).toBe(interceptor);
    });

    it('can configure the response interceptor', () => {
      const interceptor = (response: HttpResponse) => response;
      fluentity.adapter.configure({ responseInterceptor: interceptor });
      expect(fluentity.adapter.options.responseInterceptor).toBe(interceptor);
    });

    it('can configure the error interceptor', () => {
      const interceptor = vi.fn();
      fluentity.adapter.configure({ errorInterceptor: interceptor });
      expect(fluentity.adapter.options.errorInterceptor).toBe(interceptor);
    });
  });

  describe('HTTP Methods', () => {
    beforeEach(() => {
      fluentity = Fluentity.initialize({
        adapter: new RestAdapter({
          baseUrl: 'https://api.example.com',
        }),
      });
    });

    const testHttpMethod = (method: string) => {
      it(`can call a ${method} request`, async () => {
        vi.spyOn(fluentity.adapter, 'call').mockImplementation(queryBuilder => {
          expect(queryBuilder.resource).toBe('users');
          expect(queryBuilder.method).toBe(method);
          return Promise.resolve({ data: true });
        });

        const queryBuilder = new QueryBuilder();
        queryBuilder.resource = 'users';
        queryBuilder.method = method as any;

        const response = await fluentity.adapter.call(queryBuilder);
        expect(response).toBeDefined();
        expect(response.data).toBe(true);
      });
    };

    Object.values(Methods).forEach(method => testHttpMethod(method));
  });

  describe('Call Methods', () => {
    let mockQueryBuilder: QueryBuilder;

    beforeEach(() => {
      fluentity = Fluentity.initialize({
        adapter: new RestAdapter({
          baseUrl: 'https://api.example.com',
        }),
      });
      mockQueryBuilder = new QueryBuilder();
      mockQueryBuilder.resource = 'test';
    });

    it('should call the adapter with the query builder using instance method', async () => {
      const mockResponse = { data: { id: 1, name: 'Test' } };
      const spy = vi.spyOn(fluentity.adapter, 'call').mockResolvedValue(mockResponse);

      const response = await fluentity.call(mockQueryBuilder);

      expect(spy).toHaveBeenCalledWith(mockQueryBuilder);
      expect(response).toEqual(mockResponse);
    });

    it('should call the adapter with the query builder using static method', async () => {
      const mockResponse = { data: { id: 1, name: 'Test' } };
      const spy = vi.spyOn(fluentity.adapter, 'call').mockResolvedValue(mockResponse);

      const response = await Fluentity.call(mockQueryBuilder);

      expect(spy).toHaveBeenCalledWith(mockQueryBuilder);
      expect(response).toEqual(mockResponse);
    });

    it('should handle errors from the adapter in instance method', async () => {
      const error = new Error('API Error');
      vi.spyOn(fluentity.adapter, 'call').mockRejectedValue(error);

      await expect(fluentity.call(mockQueryBuilder)).rejects.toThrow('API Error');
    });

    it('should handle errors from the adapter in static method', async () => {
      const error = new Error('API Error');
      vi.spyOn(fluentity.adapter, 'call').mockRejectedValue(error);

      await expect(Fluentity.call(mockQueryBuilder)).rejects.toThrow('API Error');
    });

    it('should maintain type safety with the adapter response in instance method', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'Test',
          email: 'test@example.com',
        },
      };
      vi.spyOn(fluentity.adapter, 'call').mockResolvedValue(mockResponse);

      const response = await fluentity.call(mockQueryBuilder);

      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('email');
      expect(typeof response.data.id).toBe('number');
      expect(typeof response.data.name).toBe('string');
      expect(typeof response.data.email).toBe('string');
    });

    it('should maintain type safety with the adapter response in static method', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'Test',
          email: 'test@example.com',
        },
      };
      vi.spyOn(fluentity.adapter, 'call').mockResolvedValue(mockResponse);

      const response = await Fluentity.call(mockQueryBuilder);

      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('email');
      expect(typeof response.data.id).toBe('number');
      expect(typeof response.data.name).toBe('string');
      expect(typeof response.data.email).toBe('string');
    });
  });
});
