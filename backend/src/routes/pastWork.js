// src/routes/pastWork.js
const express = require('express')
const { body } = require('express-validator')
const ctrl = require('../controllers/pastWorkController')
const auth = require('../middleware/auth')
const { handleValidation } = require('../middleware/validate')

const router = express.Router()
const validate = [
  body('title').notEmpty().withMessage('Title is required.'),
  body('industry').notEmpty().withMessage('Industry is required.'),
  body('description').notEmpty().withMessage('Description is required.'),
  handleValidation,
]

router.get('/',       ctrl.getAll)
router.post('/',      auth, validate, ctrl.create)
router.put('/:id',    auth, validate, ctrl.update)
router.delete('/:id', auth,           ctrl.remove)

module.exports = router
