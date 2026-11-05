# Frontend

The website's page implementations, UI components, shared site chrome and global styles
live here.

| Path | Purpose |
| --- | --- |
| `pages/` | Homepage, tours, booking and tour-detail page implementations |
| `components/` | Reusable visual and interactive components |
| `SiteChrome.tsx` | Shared navigation, decorative canvas and assistant |
| `styles/globals.css` | Global Tailwind theme and site styles |

Next.js requires route entry points in the root `app/` directory. Those files stay as
thin adapters that render the corresponding implementation in `pages/`. The root
`public/` directory also stays in place because Next.js serves static assets from there.

Shared site data and types remain in `lib/`; server-only actions and integrations live in
`backend/`.
