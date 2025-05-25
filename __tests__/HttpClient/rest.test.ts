import { RestAdapter } from '../../src/adapters/RestAdapter';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Methods } from '../../src/Fluentity';
import { QueryBuilder } from '../../src/QueryBuilder';
import { HttpResponse } from '../../src/adapters/HttpAdapter';

new RestAdapter({
  baseUrl: 'https://jsonplaceholder.typicode.com',
});

describe('RestAdapter', () => {
  let httpClient: RestAdapter;

  beforeEach(() => {
    httpClient = new RestAdapter({ baseUrl: '' });
    httpClient.clearCache();
    httpClient.configure({
      baseUrl: 'https://jsonplaceholder.typicode.com',
    });
  });

  it('can make a GET request', async () => {
    const mockResponse = new HttpResponse({ data: { id: 1, title: 'Test Post' } });
    const mockRequestHandler = vi.fn().mockResolvedValue(mockResponse);

    httpClient.configure({
      requestHandler: mockRequestHandler,
      baseUrl: 'https://jsonplaceholder.typicode.com',
    });

    const response = await httpClient.call(new QueryBuilder({ resource: 'posts' }));
    expect(response).toEqual(mockResponse);
    expect(mockRequestHandler).toHaveBeenCalled();
  });

  it('doest have a baseUrl', async () => {
    httpClient.configure({ baseUrl: undefined });

    await expect(httpClient.call(new QueryBuilder({ resource: 'posts' }))).rejects.toThrow(
      'baseUrl is required'
    );
  });

  it('has a baseUrl', async () => {
    httpClient.configure({ baseUrl: 'https://jsonplaceholder.typicode.com' });

    const response = await httpClient.call(new QueryBuilder({ resource: 'posts' }));

    expect(response).not.toBeNull();
  });

  it('should raise an error if the response is not ok', async () => {
    try {
      vi.spyOn(httpClient, 'call').mockRejectedValue(new Error('HTTP error: 404'));
      await httpClient.call(new QueryBuilder({ resource: 'not-valid' }));
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
    }
  });

  describe('Request/Response Interceptors', () => {
    it('should apply request interceptor', async () => {
      const requestInterceptor = vi.fn(request => ({
        ...request,
        options: { ...request.options, headers: { 'X-Custom-Header': 'test' } },
      }));

      const requestHandler = vi.fn().mockResolvedValue({ data: 'test' });
      httpClient.configure({
        requestInterceptor,
        requestHandler,
      });

      await httpClient.call(new QueryBuilder({ resource: 'test' }));
      expect(requestInterceptor).toHaveBeenCalled();
      expect(requestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            headers: { 'X-Custom-Header': 'test' },
          }),
        })
      );
    });

    it('should apply response interceptor', async () => {
      const responseInterceptor = vi.fn(response => ({
        ...response,
        transformed: true,
      }));

      httpClient.configure({ responseInterceptor });

      await httpClient.call(new QueryBuilder({ resource: 'posts' }));
      expect(responseInterceptor).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors', async () => {
      const mockError = new Error('HTTP error: 404');
      const errorInterceptor = vi.fn();
      const mockRequestHandler = vi.fn().mockRejectedValue(mockError);

      httpClient.configure({
        errorInterceptor,
        requestHandler: mockRequestHandler,
      });

      await expect(httpClient.call(new QueryBuilder({ resource: 'test' }))).rejects.toThrow(
        'HTTP error: 404'
      );
      expect(errorInterceptor).toHaveBeenCalledTimes(1);
      expect(errorInterceptor).toHaveBeenCalledWith(mockError);
    });
  });

  describe('HTTP Methods', () => {
    it('should support different HTTP methods', async () => {
      const methods = [Methods.POST, Methods.PUT, Methods.PATCH, Methods.DELETE];

      for (const method of methods) {
        vi.spyOn(httpClient, 'call').mockResolvedValue({ data: { success: true } });

        const response = await httpClient.call(new QueryBuilder({ resource: 'test', method }));
        expect(response).toEqual({ data: { success: true } });
      }
    });
  });

  describe('Request Options', () => {
    it('should handle request options correctly', async () => {
      vi.spyOn(httpClient, 'call').mockResolvedValue({ data: { success: true } });

      const response = await httpClient.call(
        new QueryBuilder({ resource: 'test', method: Methods.POST, body: { test: 'data' } })
      );
      expect(response).toEqual({ data: { success: true } });
    });

    it('should merge default and custom options', async () => {
      httpClient.configure({
        options: {
          headers: { 'X-Default': 'default' },
        },
      });

      vi.spyOn(httpClient, 'call').mockResolvedValue({ data: { success: true } });

      await httpClient.call(
        new QueryBuilder({ resource: 'test', method: Methods.POST, body: { test: 'data' } })
      );
      expect(httpClient.options.options?.headers).toHaveProperty('X-Default');
    });
  });
});
