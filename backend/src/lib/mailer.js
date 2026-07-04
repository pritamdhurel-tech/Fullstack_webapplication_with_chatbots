// src/lib/mailer.js
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT),
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

/**
 * Send confirmation emails after Contact Us form submission (FR6)
 * @param {{ full_name, email, company_name, job_title, job_details }} data
 */
async function sendEnquiryEmails(data) {
  const { full_name, email, company_name, job_title, job_details } = data

  // Email to customer
  await transporter.sendMail({
    from:    `"AI-Solutions" <${process.env.SMTP_USER}>`,
    to:      email,
    subject: 'Thank you for contacting AI-Solutions',
    html: `
      <p>Dear ${full_name},</p>
      <p>Thank you for visiting the AI Solutions website and reaching out to us.</p>
      <p>We have received your enquiry and a member of our team will be in touch with you shortly.</p>
      <p><strong>Your submission details:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${full_name}</li>
        <li><strong>Company:</strong> ${company_name}</li>
        <li><strong>Job Title:</strong> ${job_title}</li>
        <li><strong>Job Details:</strong> ${job_details}</li>
      </ul>
      <p>Kind regards,<br/>The AI-Solutions Team<br/>Sunderland, UK</p>
    `,
  })

  // Notification to admin
  await transporter.sendMail({
    from:    `"AI-Solutions Website" <${process.env.SMTP_USER}>`,
    to:      process.env.ADMIN_EMAIL_RECIPIENT,
    subject: `New enquiry from ${full_name} — ${company_name}`,
    html: `
      <p>A new enquiry has been submitted via the Contact Us form.</p>
      <ul>
        <li><strong>Name:</strong> ${full_name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Company:</strong> ${company_name}</li>
        <li><strong>Job Title:</strong> ${job_title}</li>
        <li><strong>Job Details:</strong> ${job_details}</li>
      </ul>
    `,
  })
}

module.exports = { sendEnquiryEmails }
