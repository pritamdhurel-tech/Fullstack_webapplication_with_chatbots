// src/controllers/solutionsController.js
const prisma = require('../lib/prisma')

async function getAll(req, res) {
  try {
    const solutions = await prisma.solution.findMany({ orderBy: { created_at: 'asc' } })
    res.json({ data: solutions })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch solutions.' })
  }
}

async function create(req, res) {
  try {
    const solution = await prisma.solution.create({ data: req.body })
    res.status(201).json(solution)
  } catch (err) {
    res.status(500).json({ error: 'Could not create solution.' })
  }
}

async function update(req, res) {
  try {
    const solution = await prisma.solution.update({
      where: { id: Number(req.params.id) },
      data:  req.body,
    })
    res.json(solution)
  } catch (err) {
    res.status(500).json({ error: 'Could not update solution.' })
  }
}

async function remove(req, res) {
  try {
    await prisma.solution.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Solution deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Could not delete solution.' })
  }
}

module.exports = { getAll, create, update, remove }
