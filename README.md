# BlogVerse Pro

A modern multi-user blog built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and Cloudinary.

## Features

- User registration and login
- Front-page blog publishing with image upload
- Public feed with search-less clean browsing experience
- Dynamic blog details page
- Like and comment system
- Author-only edit/delete-ready backend structure
- Responsive modern UI


## Run locally

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Use PostgreSQL in production.
- Cloudinary stores blog images.
- Prisma manages the schema and queries.
# BLOGVERSE
