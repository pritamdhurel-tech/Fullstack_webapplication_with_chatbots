// src/routes/enquiries.js
const express = require('express')
const { getAll } = require('../controllers/enquiriesController')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, getAll)

module.exports = router
