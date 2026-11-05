import {
  GET as assistantGET,
  POST as assistantPOST,
} from "@/backend/api/assistant";

/**
 * Next.js requires route handlers to live in app/api/<name>/route.ts, so this
 * file is only a thin bridge. The real assistant logic lives in
 * backend/api/assistant.ts.
 */

export const dynamic = "force-dynamic";

export function GET() {
  return assistantGET();
}

export function POST(req: Request) {
  return assistantPOST(req);
}
