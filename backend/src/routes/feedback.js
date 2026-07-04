const express = require('express')
const { body } = require('express-validator')
const ctrl = require('../controllers/feedbackController')
const auth = require('../middleware/auth')
const { handleValidation } = require('../middleware/validate')

const router = express.Router()
const validate = [
  body('feedback_text').notEmpty().withMessage('Feedback text is required.'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
  body('customer_name').notEmpty().withMessage('Customer name is required.'),
  handleValidation,
]

// Public routes
router.get('/',       ctrl.getAll)
router.post('/',      validate, ctrl.create) // Public feedback submission

// Admin routes
router.get('/admin',            auth, ctrl.getAllAdmin)
router.put('/:id',              auth, validate, ctrl.update)
router.patch('/:id/approve',    auth, ctrl.toggleApprove)
router.delete('/:id',           auth, ctrl.remove)

module.exports = router
