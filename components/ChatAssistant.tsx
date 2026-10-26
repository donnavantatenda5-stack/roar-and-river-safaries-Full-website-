"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

const GREETING =
  "Hi! I'm the Roar and River assistant. Ask me about tours, prices, or planning your Victoria Falls trip.";

const SUGGESTIONS = [
  "What tours do you offer?",
  "Best time to see the Falls?",
  "Plan me a 3-day itinerary",
  "How do I book?",
];

const FRIENDLY_ERROR =
  "Sorry, I couldn't reach the safari desk just now. Please try again in a moment, or use the booking form at /book.";

const MAX_INPUT_CHARS = 1000;

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Greeting and local errors stay out of the history sent to the API. */
  local?: boolean;
};

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "assistant", content: GREETING, local: true },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const nextId = () => {
    idRef.current += 1;
    return `message-${idRef.current}`;
  };

  const showSuggestions = !messages.some((message) => message.role === "user");

  useEffect(() => {
    if (!open) return;

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 150);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, loading, error, open]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_INPUT_CHARS);
    if (!content || loading) return;

    setError(null);

    const userMessage: Message = { id: nextId(), role: "user", content };
    const history = [...messages, userMessage]
      .filter((message) => !message.local)
      .slice(-12)
      .map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      }));

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = (await response.json().catch(() => null)) as
        | { reply?: unknown; error?: unknown }
        | null;

      if (!response.ok) throw new Error("Request failed");
      if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("Empty reply");
      }

      const reply = data.reply.trim();

      setMessages((current) => [
        ...current,
        {
          id: nextId(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch {
      setError(FRIENDLY_ERROR);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end sm:bottom-7 sm:right-7">
      {open && (
        <div
          id="rr-assistant-panel"
          role="dialog"
          aria-label="Roar and River travel assistant"
          className="mb-4 flex h-[min(72dvh,560px)] w-[calc(100vw-2.5rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-gold/40 bg-ivory shadow-[0_24px_70px_rgba(18,40,26,0.38)]"
        >
          <div className="flex items-center gap-3 bg-forest px-5 py-4 text-white">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-forest-soft font-serif text-[13px] font-bold tracking-wide text-gold">
              RR
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-[17px] font-bold leading-tight">
                Roar and River Safaris
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-sand">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8fbf7f]" aria-hidden="true" />
                Local travel guide
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sand transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
          >
            <p className="rounded-xl border border-gold/30 bg-cream/70 px-3 py-2 text-center text-[10.5px] font-bold uppercase tracking-[0.16em] text-gold-dark">
              Local guides &middot; Fair prices &middot; Unforgettable memories
            </p>

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && <AssistantAvatar />}

                <div
                  className={cn(
                    "max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[14.5px] leading-relaxed",
                    message.role === "user"
                      ? "rounded-br-md bg-forest text-ivory"
                      : "rounded-bl-md border border-line bg-white text-forest shadow-sm"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && <TypingBubble />}

            {error && (
              <div className="flex items-end gap-2 justify-start">
                <AssistantAvatar />
                <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-[#d7a184]/50 bg-[#fff4ec] px-3.5 py-2.5 text-[14px] leading-relaxed text-[#7a3f22]">
                  {error}{" "}
                  <Link
                    href="/book"
                    className="font-bold underline underline-offset-2 hover:text-forest"
                  >
                    Open the booking form
                  </Link>
                </div>
              </div>
            )}

            {showSuggestions && !loading && (
              <div className="space-y-2 pt-1">
                <p className="px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void send(suggestion)}
                      className="rounded-xl border border-gold/50 bg-white px-3 py-2 text-left text-[13px] font-semibold leading-snug text-forest transition-colors hover:border-gold hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-line bg-white/80 p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-line bg-white p-1.5 pl-3 transition focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20">
              <label htmlFor="rr-assistant-input" className="sr-only">
                Ask the travel assistant
              </label>
              <textarea
                id="rr-assistant-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send(input);
                  }
                }}
                maxLength={MAX_INPUT_CHARS}
                placeholder="Ask about tours, prices or your trip..."
                className="max-h-28 min-h-[38px] flex-1 resize-none bg-transparent py-2 text-[14.5px] leading-snug text-forest outline-none placeholder:text-muted/70"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-gold transition hover:bg-forest-soft disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted">
              Replies take a few seconds. Enquiries only, not confirmed bookings.
            </p>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="rr-assistant-panel"
        aria-label={open ? "Close travel assistant" : "Chat with the travel assistant"}
        className={cn(
          "relative flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full border-2 border-gold bg-forest text-gold shadow-[0_12px_32px_rgba(18,40,26,0.4)] transition-transform hover:scale-105 hover:bg-forest-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
          open && "scale-95"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
        {!open && (
          <span
            className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-ivory bg-gold"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-cream font-serif text-[10px] font-bold text-gold-dark"
      aria-hidden="true"
    >
      RR
    </span>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2 justify-start" aria-label="Assistant is typing">
      <AssistantAvatar />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3.5 shadow-sm">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-dark motion-reduce:animate-none"
            style={{ animationDelay: `${delay}ms` }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
