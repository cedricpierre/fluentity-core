import { expect, describe, it, beforeEach, mock, spyOn, beforeAll } from 'bun:test';
import { User } from '../examples/models/User';
import { Post } from '../examples/models/Post';
import { Comment } from '../examples/models/Comment';
import { Fluentity, RestAdapter } from '../src';
import { Company } from '../examples/models/Company';
import { Media } from '../examples/models/Media';
import { HttpResponse } from '../src/adapters/HttpAdapter';
import { Address } from '../examples/models/Address';
import { HasManyRelationBuilder } from '../src/HasManyRelationBuilder';
import { HasOneRelationBuilder } from '../src/HasOneRelationBuilder';

let fluentity: Fluentity<RestAdapter>;

beforeAll(() => {
  Fluentity.reset();
  fluentity = Fluentity.initialize<RestAdapter>({
    adapter: new RestAdapter({
      baseUrl: 'https://jsonplaceholder.typicode.com',
      options: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    }),
  });
});

describe('API', () => {
  beforeEach(() => {
    mock.restore();
  });

  it('should fetch all users', async () => {
    const users = await User.all();
    expect(fluentity.adapter.request.url).toBe('users');
    expect(users).toBeDefined();
  });

  it('should fetch one user with address', async () => {
    const user = await User.find(1);
    expect(fluentity.adapter.request.url).toBe('users/1');
    expect(user).toBeDefined();
    expect(user.address).toBeDefined();
    expect(user.address).toBeInstanceOf(HasOneRelationBuilder<Address>);
    expect(user.address.data).toBeInstanceOf(Address);
    expect(user.address.data.street).toBe('Kulas Light');


    expect(user.posts.data).toBeUndefined();
    await user.posts.all();

    expect(fluentity.adapter.request.url).toBe('users/1/posts');
    expect(user.posts.data).toBeDefined();
    expect(user.posts.data).toBeInstanceOf(Array);
    expect(user.posts.data.length).toBe(10);
    // expect(user.posts.data[0].title).toBe('sunt aut facere repellat provident occaecati excepturi optio reprehenderit');
  });

  it('can get a user by id', async () => {
    const user = await User.id(1).get();
    expect(fluentity.adapter.request.url).toBe('users/1');
    expect(user).toBeDefined();
  });

  it('can create a User', async () => {
    const user = new User({ name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 });
    await user.save();
    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
  });

  it('can create a new User', async () => {
    const user = await new User({ name: 'Cedric', email: 'cedric@example.com', phone: 1234567890 });
    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
  });

  it('should fetch a user by id', async () => {
    const user = await User.find(1);
    expect(fluentity.adapter.request.url).toBe('users/1');
    expect(user).toBeDefined();

    expect(user.company).toBeDefined();
    expect(user.company).toBeInstanceOf(Company);
  });

  it('should get a user by id', async () => {
    const user = await User.id(1).get();
    expect(fluentity.adapter.request.url).toBe('users/1');
    expect(user).toBeDefined();

    expect(user.company).toBeDefined();
    expect(user.company).toBeInstanceOf(Company);
  });

  it('should create a user', async () => {
    spyOn(fluentity.adapter, 'call').mockResolvedValue({
      data: { id: 1, name: 'Cedric', email: 'cedric@example.com' },
    });

    const user = await User.create({ name: 'Cedric', email: 'cedric@example.com' });

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe('Cedric');
    expect(user.email).toBe('cedric@example.com');
  });

  it('should update a user', async () => {
    const user = await User.update(1, { name: 'Cedric updated' });
    expect(fluentity.adapter.request.url).toBe('users/1');
    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe('Cedric updated');
  });

  it('should delete a user', async () => {
    await User.delete(1);
    expect(fluentity.adapter.request.url).toBe('users/1');
  });

  it('Should fetch all comments from a post', async () => {
    const comments = await Post.id(1).comments.all();
    expect(fluentity.adapter.request.url).toBe('posts/1/comments');
    expect(comments).toBeDefined();
    expect(comments).toBeInstanceOf(Array);
    expect(comments.length).toBeGreaterThan(0);
  });

  it('Should create a comment', async () => {
    const comment = await Post.id(1).comments.create({
      name: 'Cedric',
      email: 'cedric@example.com',
    });

    expect(fluentity.adapter.request.url).toBe('posts/1/comments');
    
    expect(comment).toBeDefined();
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.name).toBe('Cedric');
  });

  it('should create a comment with a custom method', async () => {
    const response = await User.login('cedric', 'password');
    expect(fluentity.adapter.request.url).toBe('login');
    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(User);
  });

  it('can transform the response', async () => {
    fluentity.adapter.configure({
      responseInterceptor: (response: HttpResponse<User>) => {
        response.data.name = 'Cedric';
        return response;
      },
    });

    const user = await User.find(1);
    expect(user.name).toBe('Cedric');
  });

  it('can fetch one post', async () => {
    const post = await Post.find(1);
    expect(fluentity.adapter.request.url).toBe('posts/1');
    expect(post).toBeDefined();
    expect(post).toBeInstanceOf(Post);

    let comments = await post.comments.all();
    expect(fluentity.adapter.request.url).toBe('posts/1/comments');
    expect(comments).toBeDefined();
    expect(comments).toBeInstanceOf(Array);
    expect(comments.length).toBeGreaterThan(0);

    post.update({ title: 'Cedric updated' });
    expect(fluentity.adapter.request.url).toBe('posts/1');
    expect(post.title).toBe('Cedric updated');

    post.title = 'Cedric updated 2';
    await post.save();
    expect(fluentity.adapter.request.url).toBe('posts/1');
    expect(post.title).toBe('Cedric updated 2');

    post.comments.create({ name: 'Cedric', email: 'cedric@example.com' });
    expect(fluentity.adapter.request.url).toBe('posts/1/comments');
    comments = await post.comments.all();
    expect(fluentity.adapter.request.method).toBe('GET');
    expect(comments).toBeDefined();
    expect(comments).toBeInstanceOf(Array);
    expect(comments.length).toBeGreaterThan(0);

    const comment = comments[0];
    expect(comment).toBeDefined();
    expect(comment).toBeInstanceOf(Comment);

    await Comment.update(1, { name: 'Cedric updated 2' });
    expect(fluentity.adapter.request.url).toBe('comments/1');

    await comment.update({ name: 'Cedric updated' });
    expect(fluentity.adapter.request.url).toBe('posts/1/comments/1');
  });

  it('can fetch a post with comments', async () => {
    const comments = await Post.id(1).comments.all();
    expect(fluentity.adapter.request.url).toBe('posts/1/comments');
    expect(comments).toBeDefined();

    const comment = comments[0];
    expect(comment).toBeDefined();
    expect(comment).toBeInstanceOf(Comment);

    comment.update({ name: 'Cedric updated' });
    expect(comment.name).toBe('Cedric updated');
  });

  it('can fetch all posts and all comments then update a comment', async () => {
    const posts = await Post.all();
    expect(fluentity.adapter.request.url).toBe('posts');
    expect(posts).toBeDefined();
    expect(posts).toBeInstanceOf(Array);
    expect(posts.length).toBeGreaterThan(0);

    const comments = await posts[0].comments.all();
    expect(fluentity.adapter.request.url).toBe('posts/1/comments');
    expect(comments).toBeDefined();
    expect(comments).toBeInstanceOf(Array);
    expect(comments.length).toBeGreaterThan(0);

    const comment = comments[0];
    expect(comment).toBeDefined();
    expect(comment).toBeInstanceOf(Comment);

    comment.update({ name: 'Cedric updated lol' });
    expect(fluentity.adapter.request.url).toBe('posts/1/comments/1');
    expect(comment.name).toBe('Cedric updated lol');
  });

  it('can fetch one and all posts and comments', async () => {
    await Post.find(1);
    await Post.all();
  });
});
