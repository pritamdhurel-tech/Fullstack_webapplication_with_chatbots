// src/controllers/enquiriesController.js
const prisma = require('../lib/prisma')

async function getAll(req, res) {
  try {
    const [enquiries, total] = await prisma.$transaction([
      prisma.enquiry.findMany({ orderBy: { submitted_at: 'desc' } }),
      prisma.enquiry.count(),
    ])
    res.json({ data: enquiries, total })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch enquiries.' })
  }
}

module.exports = { getAll }
