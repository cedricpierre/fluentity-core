import { describe, it, expect, beforeEach, mock, spyOn } from 'bun:test'
import { QueryBuilder } from '../src/QueryBuilder'

describe('QueryBuilder', () => {

  beforeEach(() => {
    mock.restore();
  });

  it('can build a query string', () => {
    const queryBuilder = new QueryBuilder()
    queryBuilder.where({ name: 'Cedric' })
    queryBuilder.filter({ email: 'cedric@example.com' })
    expect(queryBuilder.toObject()).toEqual({query : { name: 'Cedric', email: 'cedric@example.com' }})
  })

  it('can build a query string with a limit', () => {
    const queryBuilder = new QueryBuilder()
    queryBuilder.limit = 10
    expect(queryBuilder.toObject()).toEqual({ limit: 10, query: {} })
  })  

  it('can build a query string with an offset', () => {
    const queryBuilder = new QueryBuilder()
    queryBuilder.offset = 10
    expect(queryBuilder.toObject()).toEqual({ offset: 10, query: {} })
  })  

  it('can build a query string with a page', () => {
    const queryBuilder = new QueryBuilder()
    queryBuilder.page = 10
    expect(queryBuilder.toObject()).toEqual({ page: 10, query: {} })
  })  

  it('can build a query string with a perPage', () => {
    const queryBuilder = new QueryBuilder()
    queryBuilder.perPage = 10
    expect(queryBuilder.toObject()).toEqual({ perPage: 10, query: {} })
  })      
  
  it('can build a query string with a sort', () => {
    const queryBuilder = new QueryBuilder()
    queryBuilder.sort = 'name'
    queryBuilder.direction = 'asc'
    expect(queryBuilder.toObject()).toEqual({ sort: 'name', direction: 'asc', query: {} })
  })  

  it('can build a query string with a sort', () => {  
    const queryBuilder = new QueryBuilder()
    queryBuilder.sort = 'name'
    queryBuilder.direction = 'desc'
    expect(queryBuilder.toObject()).toEqual({ sort: 'name', direction: 'desc', query: {} })
  })  
  
})