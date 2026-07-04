// src/controllers/eventsController.js
const prisma = require('../lib/prisma')

async function getAll(req, res) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: { gallery_images: { select: { id: true, image_url: true } } },
    })
    res.json({ data: events })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch events.' })
  }
}

async function create(req, res) {
  try {
    const event = await prisma.event.create({ data: req.body })
    res.status(201).json(event)
  } catch (err) {
    res.status(500).json({ error: 'Could not create event.' })
  }
}

async function update(req, res) {
  try {
    const event = await prisma.event.update({
      where: { id: Number(req.params.id) },
      data:  req.body,
    })
    res.json(event)
  } catch (err) {
    res.status(500).json({ error: 'Could not update event.' })
  }
}

async function remove(req, res) {
  try {
    await prisma.event.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Event deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Could not delete event.' })
  }
}

module.exports = { getAll, create, update, remove }
