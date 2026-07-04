// src/routes/contact.js
const express = require('express')
const { body } = require('express-validator')
const { submitEnquiry } = require('../controllers/contactController')
const { handleValidation } = require('../middleware/validate')

const router = express.Router()

router.post('/', [
  body('full_name').notEmpty().withMessage('Full name is required.'),
  body('email').isEmail().withMessage('A valid email address is required.'),
  body('phone').notEmpty().withMessage('Phone number is required.')
    .matches(/^\+?[\d\s\-()\\.]{7,}$/).withMessage('Please enter a valid phone number.'),
  body('company_name').notEmpty().withMessage('Company name is required.'),
  body('country').notEmpty().withMessage('Country is required.'),
  body('job_title').notEmpty().withMessage('Job title is required.'),
  body('job_details').notEmpty().withMessage('Job details are required.'),
  handleValidation,
], submitEnquiry)

module.exports = router
