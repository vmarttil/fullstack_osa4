const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe('get', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all the blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('identifier property is called id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('post', () => {
  test('when a valid blog is added, blog count increases', async () => {
    await api
      .post('/api/blogs')
      .send(helper.blogToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsFinal = await helper.blogsInDb()
    expect(blogsFinal.length).toBe(helper.initialBlogs.length + 1)
  })

  test('the title of the added blog is found', async () => {
    await api
      .post('/api/blogs')
      .send(helper.blogToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsFinal = await helper.blogsInDb()
    const titles = blogsFinal.map((blog) => blog.title)
    expect(titles).toContain(helper.blogToAdd.title)
  })

  test('if no likes are given for an added blog, a value of 0 is added', async () => {
    await api
      .post('/api/blogs')
      .send(helper.blogWithNoLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get(`/api/blogs/${helper.blogWithNoLikes._id}`)
    expect(response.body.likes).toBe(0)
  })
})


describe('delete', () => {
  test('when a blog is deleted, blog count decreases', async () => {
    await api
      .delete(`/api/blogs/${helper.initialBlogs[1]._id}`)
      .expect(204)
    const blogsFinal = await helper.blogsInDb()
    expect(blogsFinal.length).toBe(helper.initialBlogs.length - 1)
  })

  test('the title of the deleted blog is no longer found', async () => {
    await api
      .delete(`/api/blogs/${helper.initialBlogs[1]._id}`)
      .expect(204)
    const blogsFinal = await helper.blogsInDb()
    const titles = blogsFinal.map((blog) => blog.title)
    expect(titles).not.toContain(helper.initialBlogs[1].title)
  })
})

describe('put', () => {
  test('the updated title of a blog is returned correctly', async () => {
    await api
      .put(`/api/blogs/${helper.initialBlogs[1]._id}`)
      .send({ title: 'This title has been changed' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogsFinal = await helper.blogsInDb()
    const titles = blogsFinal.map((blog) => blog.title)
    expect(titles).toContain('This title has been changed')
  })

  test('the updated author of a blog is returned correctly', async () => {
    await api
      .put(`/api/blogs/${helper.initialBlogs[1]._id}`)
      .send({ author: 'Changed Author' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogsFinal = await helper.blogsInDb()
    const authors = blogsFinal.map((blog) => blog.author)
    expect(authors).toContain('Changed Author')
  })

  test('the updated likes of a blog are returned correctly', async () => {
    await api
      .put(`/api/blogs/${helper.initialBlogs[1]._id}`)
      .send({ likes: 25 })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogsFinal = await helper.blogsInDb()
    const likeCounts = blogsFinal.map((blog) => blog.likes)
    expect(likeCounts).toContain(25)
  })

})



afterAll(() => {
  mongoose.connection.close()
})