import { describe, it, expect, vi, beforeEach } from 'vitest'
import { URLQueryBuilder } from '../src/URLQueryBuilder'

describe('URLQueryBuilder', () => {

  it('can build a query string', () => {
    const queryBuilder = new URLQueryBuilder()
    queryBuilder.where({ name: 'Cedric' })
    queryBuilder.filter({ email: 'cedric@example.com' })
    queryBuilder.include('medias')
    expect(queryBuilder.toQueryString()).toBe('name=Cedric&email=cedric@example.com&include=medias')
  })

  it('can build a query string with a limit', () => {
    const queryBuilder = new URLQueryBuilder()
    queryBuilder.limit(10)
    expect(queryBuilder.toQueryString()).toBe('limit=10')
  })  

  it('can build a query string with an offset', () => {
    const queryBuilder = new URLQueryBuilder()
    queryBuilder.offset(10)
    expect(queryBuilder.toQueryString()).toBe('offset=10')
  })  

  it('can build a query string with a page', () => {
    const queryBuilder = new URLQueryBuilder()
    queryBuilder.page(10)
    expect(queryBuilder.toQueryString()).toBe('page=10')
  })  

  it('can build a query string with a perPage', () => {
    const queryBuilder = new URLQueryBuilder()
    queryBuilder.perPage(10)
    expect(queryBuilder.toQueryString()).toBe('per_page=10')
  })      
  
  it('can build a query string with a sort', () => {
    const queryBuilder = new URLQueryBuilder()
    queryBuilder.orderBy('name', 'asc')
    expect(queryBuilder.toQueryString()).toBe('sort=name')
  })  

  it('can build a query string with a sort', () => {  
    const queryBuilder = new URLQueryBuilder()
    queryBuilder.orderBy('name', 'asc')
    queryBuilder.orderBy('email', 'desc')
    expect(queryBuilder.toQueryString()).toBe('sort=name,-email')
  })  
  
})