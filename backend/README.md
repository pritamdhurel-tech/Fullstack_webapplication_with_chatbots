# AI-Solutions Backend

Express/Node.js REST API for the AI-Solutions promotional website.
Built with: Express, Prisma ORM, PostgreSQL (Neon), JWT, bcryptjs,
Nodemailer, Multer, Cloudinary, express-validator.

---

## Quick start

```bash
npm install
cp .env.example .env        # fill in all values
npx prisma db push          # create tables on Neon
npm run db:seed             # create initial admin account
npm run dev                 # start dev server on port 5000
```

---

## Folder structure

```
backend/
├── .env.example
├── .gitignore
├── package.json
├── prisma/
│   ├── schema.prisma       ← all 8 entity models
│   └── seed.js             ← creates admin account
└── src/
    ├── index.js            ← Express app entry point
    ├── lib/
    │   ├── prisma.js       ← Prisma client singleton
    │   ├── mailer.js       ← Nodemailer (FR6)
    │   └── cloudinary.js   ← Cloudinary + Multer
    ├── middleware/
    │   ├── auth.js         ← JWT verification
    │   └── validate.js     ← express-validator handler
    ├── controllers/
    │   ├── authController.js
    │   ├── contactController.js
    │   ├── solutionsController.js
    │   ├── pastWorkController.js
    │   ├── feedbackController.js
    │   ├── galleryController.js
    │   ├── eventsController.js
    │   ├── articlesController.js
    │   └── enquiriesController.js
    └── routes/
        ├── auth.js
        ├── contact.js
        ├── solutions.js
        ├── pastWork.js
        ├── feedback.js
        ├── gallery.js
        ├── events.js
        ├── articles.js
        └── enquiries.js
```

---

## API route reference

### Public routes (no token required)

| Method | Endpoint            | Description                        | FR   |
|--------|---------------------|------------------------------------|------|
| GET    | /api/health         | Health check                       | —    |
| POST   | /api/auth/login     | Admin login (CAPTCHA + JWT)        | FR9  |
| POST   | /api/contact        | Submit Contact Us form             | FR5  |
| GET    | /api/solutions      | List all solutions                 | FR1  |
| GET    | /api/past-work      | List all past work / case studies  | FR1  |
| GET    | /api/feedback       | List all customer feedback         | FR2  |
| GET    | /api/gallery        | List all gallery images            | FR3  |
| GET    | /api/events         | List all upcoming events           | FR4  |
| GET    | /api/articles       | List all articles                  | FR1  |

### Admin routes (Bearer token required)

| Method | Endpoint              | Description                        | FR   |
|--------|-----------------------|------------------------------------|------|
| GET    | /api/enquiries        | List all enquiries + total count   | FR11 |
| POST   | /api/solutions        | Create solution                    | FR10 |
| PUT    | /api/solutions/:id    | Update solution                    | FR10 |
| DELETE | /api/solutions/:id    | Delete solution                    | FR10 |
| POST   | /api/past-work        | Create past work entry             | FR10 |
| PUT    | /api/past-work/:id    | Update past work entry             | FR10 |
| DELETE | /api/past-work/:id    | Delete past work entry             | FR10 |
| POST   | /api/feedback         | Create feedback entry              | FR10 |
| PUT    | /api/feedback/:id     | Update feedback entry              | FR10 |
| DELETE | /api/feedback/:id     | Delete feedback entry              | FR10 |
| POST   | /api/gallery          | Upload gallery image (multipart)   | FR10 |
| DELETE | /api/gallery/:id      | Delete gallery image               | FR10 |
| POST   | /api/events           | Create event                       | FR10 |
| PUT    | /api/events/:id       | Update event                       | FR10 |
| DELETE | /api/events/:id       | Delete event                       | FR10 |
| POST   | /api/articles         | Create article                     | FR10 |
| PUT    | /api/articles/:id     | Update article                     | FR10 |
| DELETE | /api/articles/:id     | Delete article                     | FR10 |

---

## Authentication

All admin routes require:
```
Authorization: Bearer <token>
```
Token is returned from POST /api/auth/login on successful login.
Tokens expire after 8 hours (configurable via JWT_EXPIRES_IN in .env).

---

## Gallery image upload

POST /api/gallery expects multipart/form-data:
- `image` (file) — required
- `caption` (string) — optional
- `event_id` (number) — optional, links image to an event (FK added per Tutorial 3)

---

## Npm scripts

| Script            | What it does                              |
|-------------------|-------------------------------------------|
| npm run dev       | Start with nodemon (auto-restart)         |
| npm start         | Start without nodemon (production)        |
| npm run db:push   | Push schema to Neon (no migration file)   |
| npm run db:migrate| Run Prisma migrations (creates SQL files) |
| npm run db:seed   | Create initial admin account              |
| npm run db:studio | Open Prisma Studio (visual DB browser)    |
