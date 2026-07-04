// prisma/seed.js
// Run with: npm run db:seed
// Seeds: admin account + all content (solutions, past work, feedback, events, articles, enquiries)
// Gallery images are excluded — add manually via admin panel (requires Cloudinary upload)

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...\n')

  // ── 1. Admin account ────────────────────────────────────────────
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: process.env.ADMIN_USERNAME ?? 'admin' },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD ?? 'admin123', 12
    )
    await prisma.admin.create({
      data: {
        username: process.env.ADMIN_USERNAME ?? 'admin',
        email:    process.env.ADMIN_EMAIL    ?? 'admin@ai-solutions.co.uk',
        password: hashedPassword,
      },
    })
    console.log('✅ Admin account created')
  } else {
    console.log('⏭️  Admin account already exists — skipped')
  }

  // ── 2. Solutions ─────────────────────────────────────────────────
  await prisma.solution.deleteMany()
  await prisma.solution.createMany({
    data: [
      {
        title:       'Process Automation',
        description: 'Replace manual workflows with AI-driven automation pipelines. Reduce errors, speed up delivery, and free your teams for high-value work across your entire organisation.',
        icon:        '⚡',
        tag:         'Enterprise',
      },
      {
        title:       'Predictive Analytics',
        description: 'Surface insights before problems emerge. Our models are trained on domain-specific data to give your teams an analytical edge and enable proactive decision-making.',
        icon:        '🧠',
        tag:         'Data-first',
      },
      {
        title:       'AI Prototyping',
        description: 'Go from idea to working prototype in days, not months. Affordable, iterative, and built with your team\'s involvement at every stage of the development process.',
        icon:        '🤖',
        tag:         'Fast-track',
      },
      {
        title:       'Conversational AI',
        description: 'Embed intelligent virtual assistants into your products and services. Our assistants are scoped to your domain, reducing hallucination risk and improving user trust.',
        icon:        '💬',
        tag:         'Scalable',
      },
      {
        title:       'Systems Integration',
        description: 'Connect your existing tools, platforms, and data sources into a unified intelligent layer without costly rebuilds or disruption to ongoing operations.',
        icon:        '🔗',
        tag:         'Low disruption',
      },
      {
        title:       'Digital Experience Audits',
        description: 'We map friction points in your employee digital experience and deliver a prioritised improvement roadmap backed by data, interviews, and process analysis.',
        icon:        '📊',
        tag:         'Consulting',
      },
    ],
  })
  console.log('✅ Solutions seeded (6 records)')

  // ── 3. Past Work ─────────────────────────────────────────────────
  await prisma.pastWork.deleteMany()
  await prisma.pastWork.createMany({
    data: [
      {
        title:       'Predictive Maintenance for Factory Floor',
        industry:    'Manufacturing',
        description: 'Deployed an AI model to flag equipment failures 72 hours before occurrence, reducing unplanned downtime across a 3-site manufacturing operation in the North East.',
        icon:        '🏭',
        year:        2024,
        metrics:     [
          { value: '67%',  label: 'Less downtime' },
          { value: '£2.1M', label: 'Savings/yr'  },
          { value: '12 wks', label: 'To deploy'  },
        ],
      },
      {
        title:       'Staff Scheduling Automation for NHS Trust',
        industry:    'Healthcare',
        description: 'Replaced a manual staff rota process with an AI scheduler that accounts for compliance requirements, staff skills, and individual preferences across 5 departments.',
        icon:        '🏥',
        year:        2024,
        metrics:     [
          { value: '80%',  label: 'Time saved'        },
          { value: '+22%', label: 'Staff satisfaction' },
          { value: '8 wks', label: 'To deploy'        },
        ],
      },
      {
        title:       'Personalised Learning Path Engine',
        industry:    'Education',
        description: 'Built a recommendation engine that adapts coursework to each learner\'s pace, knowledge gaps, and goals. Integrated into an existing LMS platform with minimal disruption.',
        icon:        '🎓',
        year:        2023,
        metrics:     [
          { value: '3×',  label: 'Completion rate'  },
          { value: '91%', label: 'Learner rating'   },
          { value: '6 wks', label: 'To deploy'      },
        ],
      },
      {
        title:       'Retail Demand Forecasting System',
        industry:    'Retail',
        description: 'Developed a demand forecasting model for a regional retail chain, reducing overstock by predicting purchasing trends across 12 store locations with seasonal adjustments.',
        icon:        '🛍️',
        year:        2023,
        metrics:     [
          { value: '34%', label: 'Less overstock'   },
          { value: '£890K', label: 'Savings/yr'     },
          { value: '10 wks', label: 'To deploy'     },
        ],
      },
    ],
  })
  console.log('✅ Past Work seeded (4 records)')

  // ── 4. Customer Feedback ─────────────────────────────────────────
  await prisma.customerFeedback.deleteMany()
  await prisma.customerFeedback.createMany({
    data: [
      {
        feedback_text: 'The AI prototyping service was exceptional. We had a working proof of concept in under two weeks — something our internal team estimated would take four months.',
        rating:        5,
        customer_name: 'James Thornton',
        company_name:  'Nexagen Ltd',
        job_title:     'Chief Technology Officer',
      },
      {
        feedback_text: 'Genuinely refreshing to work with a company that could explain the AI without jargon. The predictive analytics dashboard has become central to how we operate day to day.',
        rating:        5,
        customer_name: 'Priya Rajan',
        company_name:  'Meridian Health',
        job_title:     'Head of Operations',
      },
      {
        feedback_text: 'The integration took a little longer than planned, but the end result exceeded what we specified. The team were communicative and flexible throughout the whole project.',
        rating:        4,
        customer_name: 'Marcus Lee',
        company_name:  'Ashford Council',
        job_title:     'Digital Lead',
      },
      {
        feedback_text: 'We came to AI-Solutions with a vague idea and left with a roadmap, a prototype, and genuine confidence that we were making the right technology decisions for our business.',
        rating:        5,
        customer_name: 'Sarah O\'Brien',
        company_name:  'TerraVista Group',
        job_title:     'Innovation Director',
      },
      {
        feedback_text: 'The staff scheduling tool has saved our HR team dozens of hours every month. The compliance logic was particularly impressive — it understood our union agreements immediately.',
        rating:        5,
        customer_name: 'Dr. Alan Peters',
        company_name:  'Northern NHS Trust',
        job_title:     'Head of Workforce Planning',
      },
    ],
  })
  console.log('✅ Customer Feedback seeded (5 records)')

  // ── 5. Events ────────────────────────────────────────────────────
  await prisma.event.deleteMany()
  await prisma.event.createMany({
    data: [
      {
        name:        'AI for Industry — Sunderland Summit',
        date:        new Date('2026-08-12T09:00:00.000Z'),
        description: 'Our annual flagship event exploring AI\'s role in manufacturing, healthcare, and public services. Join industry leaders, practitioners, and innovators for a full day of talks, panels, and networking in Sunderland.',
        event_type:  'In-person',
      },
      {
        name:        'Prototyping on a Budget — Webinar',
        date:        new Date('2026-08-28T14:00:00.000Z'),
        description: 'A free online webinar aimed at small and medium-sized businesses. We cover how companies can leverage AI prototyping tools without enterprise-level budgets. Open to all — registration required.',
        event_type:  'Online',
      },
      {
        name:        'Digital Employee Experience Forum',
        date:        new Date('2026-09-09T10:00:00.000Z'),
        description: 'A hybrid panel discussion with HR and technology leaders on closing the gap between employee expectations and the digital tools currently available to them. Attend in person or join the live stream.',
        event_type:  'Hybrid',
      },
      {
        name:        'NHS Innovation Showcase',
        date:        new Date('2026-09-24T09:30:00.000Z'),
        description: 'AI-Solutions presents its staff scheduling and patient-flow optimisation work to a healthcare audience. Includes a live demonstration of the scheduling system and Q&A with the project team.',
        event_type:  'In-person',
      },
    ],
  })
  console.log('✅ Events seeded (4 records)')

  // ── 6. Articles ──────────────────────────────────────────────────
  await prisma.article.deleteMany()
  await prisma.article.createMany({
    data: [
      {
        title:          'Why most AI projects fail before they start',
        excerpt:        'The gap between AI ambition and delivery is not usually technical. It is organisational. We break down the three structural problems we see in every failed engagement and how to avoid them.',
        content:        'Most AI projects fail not because the technology does not work, but because the organisation was not ready to adopt it. After working across manufacturing, healthcare, and education, we have identified three consistent failure patterns: unclear ownership, misaligned expectations, and a lack of clean data infrastructure. This article explores each one and offers practical steps to address them before a single model is trained.',
        category:       'AI Strategy',
        author:         'AI-Solutions Team',
        published_date: new Date('2026-05-14T00:00:00.000Z'),
      },
      {
        title:          'The eight-week prototype: a transparent framework',
        excerpt:        'A detailed look at how we scope, design, and deliver an AI prototype in under two months — including what we cut, why we cut it, and what that means for the final product.',
        content:        'Our eight-week prototyping framework has been refined across more than a dozen client engagements. Week one is discovery and data audit. Weeks two and three are model selection and baseline testing. Weeks four through six are iterative build and client feedback cycles. Week seven is integration and edge case testing. Week eight is handover, documentation, and roadmap. This article walks through each phase in detail.',
        category:       'Prototyping',
        author:         'AI-Solutions Team',
        published_date: new Date('2026-04-30T00:00:00.000Z'),
      },
      {
        title:          'What NHS AI adoption actually looks like in 2026',
        excerpt:        'Following our NHS Trust engagement, we share what worked, what surprised us, and what procurement teams should know before signing an AI services contract with any provider.',
        content:        'Working with an NHS Trust on staff scheduling taught us more about institutional AI adoption than any industry report. The procurement process took longer than the build. The compliance requirements were more nuanced than anticipated. And the biggest barrier to adoption was not technical resistance — it was middle management uncertainty about what the AI would mean for their roles. This article is our honest account of the project.',
        category:       'Healthcare AI',
        author:         'AI-Solutions Team',
        published_date: new Date('2026-04-10T00:00:00.000Z'),
      },
      {
        title:          'Small business AI: where to start in 2026',
        excerpt:        'AI does not require a data science team or a six-figure budget. Here is a practical starting point for small businesses that want to explore what AI can realistically do for them right now.',
        content:        'The most common question we hear from small business owners is: where do I even begin? Our answer is always the same: start with the most repetitive task in your business that involves structured data. Invoicing, scheduling, stock management, customer query routing — these are all areas where a focused AI tool can deliver measurable return within weeks, not months. This article provides a step-by-step starting framework.',
        category:       'Small Business',
        author:         'AI-Solutions Team',
        published_date: new Date('2026-03-22T00:00:00.000Z'),
      },
    ],
  })
  console.log('✅ Articles seeded (4 records)')

  // ── 7. Enquiries (sample data for dashboard demo) ────────────────
  await prisma.enquiry.deleteMany()
  await prisma.enquiry.createMany({
    data: [
      {
        full_name:    'Rachel Nguyen',
        email:        'r.nguyen@deltacorp.com',
        phone:        '+44 7700 900123',
        company_name: 'Delta Corp',
        country:      'United Kingdom',
        job_title:    'Operations Manager',
        job_details:  'We are looking to automate our monthly reporting process. Currently this takes our team approximately 3 days per month and involves pulling data from 6 different systems. We would like to explore whether AI can reduce this to a same-day automated report.',
      },
      {
        full_name:    'Tom Bradley',
        email:        't.bradley@greenlogistics.co.uk',
        phone:        '+44 7911 234567',
        company_name: 'Green Logistics',
        country:      'United Kingdom',
        job_title:    'Head of Technology',
        job_details:  'We run a fleet of 200 vehicles and want to explore route optimisation using AI. We currently use a manual planning process that we believe is costing us significant fuel and driver time. Looking for a prototype to demonstrate the potential ROI before committing to a full build.',
      },
      {
        full_name:    'Amara Osei',
        email:        'amara.osei@nhstrust.org',
        phone:        '+44 7800 456789',
        company_name: 'Midlands NHS Trust',
        country:      'United Kingdom',
        job_title:    'Digital Transformation Lead',
        job_details:  'Following the success of a similar project at another trust, we are interested in exploring AI-assisted patient triage and appointment scheduling. We have a dataset of approximately 2 years of appointment history and want to understand what insights and automation are possible.',
      },
    ],
  })
  console.log('✅ Enquiries seeded (3 sample records)')

  // ── Summary ──────────────────────────────────────────────────────
  console.log('\n🎉 Seed complete! Your database is ready for the demo.\n')
  console.log('📋 What was seeded:')
  console.log('   • 1  admin account')
  console.log('   • 6  solutions')
  console.log('   • 4  past work / case studies')
  console.log('   • 5  customer feedback entries')
  console.log('   • 4  upcoming events')
  console.log('   • 4  articles')
  console.log('   • 3  sample enquiries (for dashboard demo)')
  console.log('\n⚠️  Gallery images: add these manually via the admin panel at /admin/gallery')
  console.log('   (Cloudinary upload requires a real image file — cannot be seeded)\n')
  console.log(`🔑 Admin login:`)
  console.log(`   Username: ${process.env.ADMIN_USERNAME ?? 'admin'}`)
  console.log(`   Password: ${process.env.ADMIN_PASSWORD ?? 'admin123'}`)
  console.log(`   URL:      http://localhost:5173/admin/login\n`)
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
