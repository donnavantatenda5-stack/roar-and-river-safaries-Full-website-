# Roar and River Safaris - full Next.js project

Complete, ready-to-run website: homepage, per-tour detail pages, /book booking form
(Supabase + Resend email), TypeScript, Tailwind CSS v4, framer-motion animations.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Homepage: hero, destinations, tours grid, why-us, how to book |
| `/tours` | Index of all six tours |
| `/tours/[slug]` | Full detail page per tour (itinerary, what's included, price, book CTA) |
| `/book` | Booking form |
| `/book?tour=[slug]` | Booking form with that tour's details shown above it |

## Run it (Windows PowerShell)
    npm install
    copy .env.example .env.local
    npm run dev
Open http://localhost:3000

The homepage works immediately with the built-in tour list. To enable bookings:
1. Create a Supabase project, open SQL Editor, paste supabase/schema.sql, Run.
2. Fill in .env.local (Supabase URL + key, Resend key, notify email, optional WhatsApp number).
3. Restart `npm run dev`, then test at http://localhost:3000/book

## Editing tour content

Long-form tour content lives in `lib/tourDetails.ts`, keyed by tour slug: summary,
start time, duration, minimum group size, meeting point, the paragraphs, what's
included, and the Important callout. This is deliberate, so the site renders before
the database is connected. Only `price_usd`, `name`, `image_url` and `description`
come from Supabase. A `description` in the database overrides the summary line in
`lib/tourDetails.ts`.

Prices in the database seed are in `supabase/schema.sql`. To change a price on a live
site, update the row directly:

    update public.tours set price_usd = 229 where slug = 'chobe-day-trip-botswana';

## Replace the placeholder photos
public/images/hero.jpg (use a high-resolution photo, 2000px+ wide)
public/images/tours/*.jpg and public/images/places/*.jpg (same file names)

## Fonts
Lato + Lora (see app/layout.tsx for how to switch to Jost + Cormorant Garamond).
