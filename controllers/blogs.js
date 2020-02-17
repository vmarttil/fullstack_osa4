const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if (!blog.likes) {
    blog.likes = 0
  }
  try {
    const result = await blog.save()
    response.status(201).json(result.toJSON())
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const content = request.body
  const blog = {}
  if (content.title) blog.title = content.title
  if (content.author) blog.author = content.author
  if (content.url) blog.url = content.url
  if (content.likes) blog.likes = content.likes
  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(result.toJSON())
  } catch(exception) {
    next(exception)
  }
})




module.exports = blogsRouter