import { expect, describe, it, beforeEach, mock, spyOn } from 'bun:test';
import { QueryBuilder } from '../src/QueryBuilder';
import { User } from '../examples/models/User';
import { Model } from '../src/Model';

describe('QueryBuilder', () => {
  let queryBuilder: QueryBuilder;

  beforeEach(() => {
    queryBuilder = new QueryBuilder();
    mock.restore();
  });

  describe('constructor', () => {
    it('should create an empty query builder by default', () => {
      expect(queryBuilder.toObject()).toEqual({ query: {} });
    });

    it('should initialize with provided options', () => {
      const options = {
        model: User as typeof Model,
        id: 123,
        limit: 10,
        page: 1,
        perPage: 20,
        sort: 'name',
        direction: 'asc',
        method: 'GET' as const,
        body: { name: 'John' },
      };
      const builder = new QueryBuilder(options);
      expect(builder.toObject()).toEqual({
        query: {},
        method: 'GET',
        sort: 'name',
        direction: 'asc',
        limit: 10,
        page: 1,
        perPage: 20,
      });
    });
  });

  describe('where', () => {
    it('should add simple where conditions', () => {
      queryBuilder.where({ status: 'active', type: 'user' });
      expect(queryBuilder.toObject()).toEqual({
        query: { status: 'active', type: 'user' },
      });
    });

    it('should merge multiple where conditions', () => {
      queryBuilder.where({ status: 'active' });
      queryBuilder.where({ type: 'user' });
      expect(queryBuilder.toObject()).toEqual({
        query: { status: 'active', type: 'user' },
      });
    });
  });

  describe('filter', () => {
    it('should add complex filter conditions', () => {
      queryBuilder.filter({
        age: { gt: 18, lt: 65 },
        status: ['active', 'pending'],
      });
      expect(queryBuilder.toObject()).toEqual({
        query: {
          age: { gt: 18, lt: 65 },
          status: ['active', 'pending'],
        },
      });
    });

    it('should merge multiple filter conditions', () => {
      queryBuilder.filter({ age: { gt: 18 } });
      queryBuilder.filter({ status: ['active'] });
      expect(queryBuilder.toObject()).toEqual({
        query: {
          age: { gt: 18 },
          status: ['active'],
        },
      });
    });
  });

  describe('reset', () => {
    it('should clear all query parameters', () => {
      queryBuilder.where({ status: 'active' }).filter({ age: { gt: 18 } });
      queryBuilder.sort = 'name';
      queryBuilder.direction = 'asc';
      queryBuilder.limit = 10;
      queryBuilder.offset = 20;
      queryBuilder.page = 2;
      queryBuilder.perPage = 25;

      queryBuilder.reset();

      expect(queryBuilder.query).toEqual({});
      expect(queryBuilder.sort).toEqual(undefined);
      expect(queryBuilder.direction).toEqual(undefined);
      expect(queryBuilder.limit).toEqual(undefined);
      expect(queryBuilder.offset).toEqual(undefined);
      expect(queryBuilder.page).toEqual(undefined);
      expect(queryBuilder.perPage).toEqual(undefined);
      expect(queryBuilder.id).toEqual(undefined);
    });
  });

  describe('pagination', () => {
    it('should handle page-based pagination', () => {
      queryBuilder.page = 2;
      queryBuilder.perPage = 25;
      expect(queryBuilder.toObject()).toEqual({
        page: 2,
        perPage: 25,
        query: {},
      });
    });

    it('should handle offset-based pagination', () => {
      queryBuilder.limit = 10;
      queryBuilder.offset = 20;
      expect(queryBuilder.toObject()).toEqual({
        limit: 10,
        offset: 20,
        query: {},
      });
    });
  });

  describe('sorting', () => {
    it('should handle ascending sort', () => {
      queryBuilder.sort = 'name';
      queryBuilder.direction = 'asc';
      expect(queryBuilder.toObject()).toEqual({
        sort: 'name',
        direction: 'asc',
        query: {},
      });
    });

    it('should handle descending sort', () => {
      queryBuilder.sort = 'created_at';
      queryBuilder.direction = 'desc';
      expect(queryBuilder.toObject()).toEqual({
        sort: 'created_at',
        direction: 'desc',
        query: {},
      });
    });
  });

  describe('parent relationship', () => {
    it('should maintain parent relationship', () => {
      const parent = new QueryBuilder({ resource: 'users' });
      const child = new QueryBuilder({ parent });

      expect(child.parent).toBeDefined();
      expect(child.parent?.resource).toBe('users');
    });
  });
});
