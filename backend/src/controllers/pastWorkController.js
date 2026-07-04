// src/controllers/pastWorkController.js
const prisma = require('../lib/prisma')

async function getAll(req, res) {
  try {
    const work = await prisma.pastWork.findMany({ orderBy: { created_at: 'desc' } })
    res.json({ data: work })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch past work.' })
  }
}

async function create(req, res) {
  try {
    const item = await prisma.pastWork.create({ data: req.body })
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ error: 'Could not create past work entry.' })
  }
}

async function update(req, res) {
  try {
    const item = await prisma.pastWork.update({
      where: { id: Number(req.params.id) },
      data:  req.body,
    })
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: 'Could not update past work entry.' })
  }
}

async function remove(req, res) {
  try {
    await prisma.pastWork.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Past work entry deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Could not delete past work entry.' })
  }
}

module.exports = { getAll, create, update, remove }
