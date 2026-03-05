# Tech Pinik

Bangladesh-focused e-commerce app built with Next.js (App Router), Better Auth, shadcn/ui, MongoDB, and ImageKit.

## Features

- **Admin panel** (secure, role-based): CRUD for Products, Categories, Sliders, and Orders
- **Guest orders**: Place order without account; phone, address, note, delivery zone (Inside Dhaka ৳65 / Outside Dhaka ৳110)
- **Invoice**: Printable invoice in admin order detail
- **Image uploads**: ImageKit for product, category, and slider images

## Setup

1. Copy `.env.local.example` to `.env.local` and set:
   - `BETTER_AUTH_SECRET` (min 32 chars; e.g. `npx auth secret`)
   - `BETTER_AUTH_URL` (e.g. `http://localhost:3000`)
   - `MONGODB_URI`
   - `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`

2. Create the first admin user (one-time):
   - Set `BOOTSTRAP_ADMIN_SECRET`, then `POST /api/bootstrap-admin` with body: `{ "secret": "<same>", "email": "admin@example.com", "password": "your-password" }`
   - Or call the API and then remove `BOOTSTRAP_ADMIN_SECRET` from env

3. Run the app and sign in at `/admin/login`.

4. **Seed sample data** (optional): With `MONGODB_URI` set in `.env.local`, run `npm run seed` to insert sample categories, products, and sliders. The script is idempotent: it skips if the database already has data.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
