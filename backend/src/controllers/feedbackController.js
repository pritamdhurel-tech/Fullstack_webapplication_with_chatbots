// src/controllers/feedbackController.js
const prisma = require('../lib/prisma')

// Public GET - only approved feedback
async function getAll(req, res) {
  try {
    const feedback = await prisma.customerFeedback.findMany({
      where: { is_approved: true },
      orderBy: { created_at: 'desc' },
    })
    res.json({ data: feedback })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch feedback.' })
  }
}

// Admin GET - all feedback
async function getAllAdmin(req, res) {
  try {
    const feedback = await prisma.customerFeedback.findMany({
      orderBy: { created_at: 'desc' },
    })
    res.json({ data: feedback })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch feedback.' })
  }
}

// Public POST
async function create(req, res) {
  try {
    const item = await prisma.customerFeedback.create({ 
      data: { ...req.body, is_approved: false } 
    })
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ error: 'Could not create feedback entry.' })
  }
}

// Admin UPDATE
async function update(req, res) {
  try {
    const item = await prisma.customerFeedback.update({
      where: { id: Number(req.params.id) },
      data:  req.body,
    })
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: 'Could not update feedback entry.' })
  }
}

// Admin TOGGLE APPROVE
async function toggleApprove(req, res) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.customerFeedback.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Feedback not found.' });

    const item = await prisma.customerFeedback.update({
      where: { id },
      data: { is_approved: !existing.is_approved }
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Could not toggle approval status.' });
  }
}

// Admin DELETE
async function remove(req, res) {
  try {
    await prisma.customerFeedback.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Feedback deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Could not delete feedback entry.' })
  }
}

module.exports = { getAll, getAllAdmin, create, update, toggleApprove, remove }
