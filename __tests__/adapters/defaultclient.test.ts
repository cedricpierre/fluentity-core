import { expect, describe, it, beforeEach, mock, spyOn } from 'bun:test';
import { DefaultAdapter } from '../../src/adapters/DefaultAdapter';
import { QueryBuilder } from '../../src/QueryBuilder';

const defaultAdapter = new DefaultAdapter();


describe('DefaultAdapter', () => {
  beforeEach(() => {
    mock.restore();
  });

  it('should make a request', async () => {
    const queryBuilder = new QueryBuilder();
    const response = await defaultAdapter.call(queryBuilder);
    expect(response).toBeDefined();
  });

  it('should configure the adapter', async () => {
    const queryBuilder = new QueryBuilder();
    defaultAdapter.configure({ baseUrl: 'https://api.example.com' });
    const response = await defaultAdapter.call(queryBuilder);
    expect(response).toBeDefined();
  });
});
