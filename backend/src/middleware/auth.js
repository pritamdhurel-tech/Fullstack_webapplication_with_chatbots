// src/middleware/auth.js
const jwt = require('jsonwebtoken')

/**
 * Protects admin routes.
 * Expects: Authorization: Bearer <token>
 * Returns 401 if token is missing, invalid, or expired.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorised — no token provided.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded // attach admin payload to request
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorised — invalid or expired token.' })
  }
}

module.exports = authMiddleware
