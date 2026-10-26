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

## AI Travel Assistant

The floating chat button in the bottom-right is `components/ChatAssistant.tsx`. It
posts to `app/api/assistant/route.ts`, which calls Google Gemini with the full live
catalog from Supabase as context. The Gemini key is only read on the server, and the
route talks to the REST API directly, so there is no extra SDK to install.

### 1. Configure

Add these to `.env.local` (server only, never commit it):

    GEMINI_API_KEY=...
    GEMINI_MODEL=gemini-3.5-flash-lite
    ASSISTANT_MIN_DELAY_MS=5000

Get a free key from https://aistudio.google.com/apikey. `gemini-3.5-flash-lite` is
the fast, reliable default for chat; `gemini-3.5-flash` is more capable but slower,
and `gemini-3.8-flash` can return 503 under high demand. Set `GEMINI_MODEL` to any
model available in your Google AI Studio account.

`ASSISTANT_MIN_DELAY_MS` is optional. The route always waits at least five seconds
(plus up to 1.2 seconds of natural jitter) before returning a reply, so the typing
indicator feels like a real person answering. Setting the variable lower has no
effect; 5000 is the floor.

### 2. Create the database tables

Run the updated `supabase/schema.sql` in the Supabase SQL Editor. It is safe to run
again on an existing project: it adds `duration` and `category` to `tours`, creates
`leads`, enables Row Level Security, and grants insert-only access to the chat
assistant. Visitors can add a lead but cannot read leads; view them in the Supabase
dashboard under Table Editor > leads.

The assistant reads `name`, `description`, `price_usd`, `duration` and `category`
from the active tours at request time. If Supabase is unavailable it falls back to
`lib/tours.ts`, the same list the website uses, so prices always match the site.

### 3. Test locally

    npm run dev

Open http://localhost:3000 and click the gold chat button. Try:

- "What tours do you offer?" - should list the live tours and prices.
- "Plan me a 3-day itinerary" - should propose a day-by-day plan.
- "I'd like to book the sunset cruise for 2 people in August" - it should ask for
  your name and email, then save the lead.
- Anything unrelated (e.g. "write me a poem") - it should politely decline.

You can also test the route directly (PowerShell). A reply takes at least 5 seconds:

    $body = '{"messages":[{"role":"user","content":"What tours do you offer?"}]}'
    Measure-Command { Invoke-RestMethod -Uri http://localhost:3000/api/assistant -Method Post -ContentType 'application/json' -Body $body }

Check Table Editor > leads in Supabase after giving the assistant a name, email,
travel dates and group size. The route keeps only the last 12 messages and limits
each message to 1,500 characters, with 20 requests per IP per 10 minutes. That
in-memory rate limit resets when the server restarts; use a shared store such as
Upstash Redis if you need it to hold across serverless instances.

If replies fail, check the browser console and the terminal. A missing
`GEMINI_API_KEY`, a model name your account cannot access, a quota error or an
expired key all produce a friendly error bubble rather than exposing the key.

## Replace the placeholder photos
public/images/hero.jpg (use a high-resolution photo, 2000px+ wide)
public/images/tours/*.jpg and public/images/places/*.jpg (same file names)

## Fonts
Lato + Lora (see app/layout.tsx for how to switch to Jost + Cormorant Garamond).
