// src/middleware/validate.js
const { validationResult } = require('express-validator')

/**
 * Shared validation handler.
 * Place after express-validator body() checks in any route.
 * Returns 400 with array of errors if validation fails.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

module.exports = { handleValidation }
