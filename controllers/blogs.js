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


blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})




module.exports = blogsRouter