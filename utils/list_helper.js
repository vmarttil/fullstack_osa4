const dummy = (blogs) => 1

const totalLikes = (array) => array.reduce((sum, blog) => sum + blog.likes,0)

const favoriteBlog = (array) => {
  if (array.length === 0) return {}
  array.sort((a, b) => b.likes - a.likes)
  const favorite = array[0]
  delete favorite.__v
  delete favorite._id
  delete favorite.url
  return favorite
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}