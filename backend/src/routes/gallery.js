// src/routes/gallery.js
const express = require('express')
const ctrl = require('../controllers/galleryController')
const auth = require('../middleware/auth')
const { upload } = require('../lib/cloudinary')

const router = express.Router()

router.get('/',       ctrl.getAll)
router.post('/',      auth, upload.single('image'), ctrl.upload)
router.delete('/:id', auth, ctrl.remove)

module.exports = router
