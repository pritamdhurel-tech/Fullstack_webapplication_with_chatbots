// src/controllers/galleryController.js
const prisma = require('../lib/prisma')
const { cloudinary } = require('../lib/cloudinary')

async function getAll(req, res) {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { created_at: 'desc' },
      include: { event: { select: { id: true, name: true } } },
    })
    const data = images.map(img => ({
      ...img,
      event_name: img.event?.name ?? null,
    }))
    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch gallery images.' })
  }
}

async function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'An image file is required.' })
  }
  try {
    const image = await prisma.galleryImage.create({
      data: {
        image_url: req.file.path,
        caption:   req.body.caption ?? null,
        event_id:  req.body.event_id ? Number(req.body.event_id) : null,
      },
    })
    res.status(201).json(image)
  } catch (err) {
    res.status(500).json({ error: 'Could not save gallery image.' })
  }
}

async function remove(req, res) {
  try {
    const image = await prisma.galleryImage.findUnique({
      where: { id: Number(req.params.id) },
    })
    if (!image) return res.status(404).json({ error: 'Image not found.' })

    const urlParts = image.image_url.split('/')
    const fileName = urlParts[urlParts.length - 1].split('.')[0]
    const publicId = `ai-solutions/gallery/${fileName}`
    await cloudinary.uploader.destroy(publicId)

    await prisma.galleryImage.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Image deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Could not delete image.' })
  }
}

module.exports = { getAll, upload, remove }
