# Backend

All server-only code for the site lives in this folder.

## Layout

| Path | Purpose |
| --- | --- |
| `actions/booking.ts` | Server action that validates a booking, writes it to Supabase and emails the team |
| `api/assistant.ts` | River Guide assistant API logic (Gemini proxy, rate limiting, prompt and weather context) |
| `lib/supabase.ts` | Supabase client used by server code |
| `lib/mailer.ts` | Booking alert email sender (SMTP or Resend) |
| `supabase/schema.sql` | Database schema and seed data for Supabase |

## How it connects to the frontend

- `app/api/assistant/route.ts` is a thin Next.js route handler that calls `api/assistant.ts`.
  Next.js requires route handlers to live inside `app/api`, so the route file stays there
  while the implementation lives here.
- `frontend/components/BookingForm.tsx` imports the booking server action from
  `@/backend/actions/booking`.
- `lib/tours.ts` loads tours from Supabase through `backend/lib/supabase.ts`, and falls
  back to the built-in catalogue when the database is not configured.

Shared data and helpers that both the UI and the backend need stay in `lib/`:
`tours.ts`, `activities.ts`, `accommodations.ts`, `tourDetails.ts`, `activityDetails.ts`,
`site.ts`, `types.ts`, `utils.ts` and `validations.ts`. The River Guide rule engine in
`lib/assistant.ts` is also shared because the chat widget runs it in the browser.

Run the app the same way as before from the project root:

    npm run dev
