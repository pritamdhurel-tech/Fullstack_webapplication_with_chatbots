// src/controllers/articlesController.js
const prisma = require('../lib/prisma')

async function getAll(req, res) {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { published_date: 'desc' },
    })
    res.json({ data: articles })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch articles.' })
  }
}

async function create(req, res) {
  try {
    const article = await prisma.article.create({ data: req.body })
    res.status(201).json(article)
  } catch (err) {
    res.status(500).json({ error: 'Could not create article.' })
  }
}

async function update(req, res) {
  try {
    const article = await prisma.article.update({
      where: { id: Number(req.params.id) },
      data:  req.body,
    })
    res.json(article)
  } catch (err) {
    res.status(500).json({ error: 'Could not update article.' })
  }
}

async function remove(req, res) {
  try {
    await prisma.article.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Article deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Could not delete article.' })
  }
}

module.exports = { getAll, create, update, remove }
