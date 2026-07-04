// src/controllers/contactController.js
const prisma = require('../lib/prisma')
const { sendEnquiryEmails } = require('../lib/mailer')

async function submitEnquiry(req, res) {
  const { full_name, email, phone, company_name, country, job_title, job_details } = req.body

  try {
    const enquiry = await prisma.enquiry.create({
      data: { full_name, email, phone, company_name, country, job_title, job_details },
    })

    try {
      await sendEnquiryEmails({ full_name, email, company_name, job_title, job_details })
    } catch (emailErr) {
      console.error('Email sending failed (non-critical):', emailErr)
    }

    res.status(201).json({ message: 'Enquiry submitted successfully.', id: enquiry.id })
  } catch (err) {
    console.error('Contact form error:', err)
    res.status(500).json({ error: 'Could not submit enquiry. Please try again.' })
  }
}

module.exports = { submitEnquiry }
