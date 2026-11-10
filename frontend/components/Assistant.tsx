"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, CloudSun, Compass, LoaderCircle, Mic, MicOff, X } from "lucide-react";
import {
  ASSISTANT_SUGGESTIONS,
  answer,
  getWeather,
  isSensitiveInfoQuestion,
  isWeatherQuestion,
  weatherInfo,
  type AssistantAction,
  type AssistantMessage,
  type WeatherReport,
} from "@/lib/assistant";
import { cn } from "@/lib/utils";

const WELCOME: AssistantMessage = {
  id: "welcome",
  role: "assistant",
  text:
    "Hi! I'm the River Guide — the Roar and River Safaris assistant.\n\n" +
    "Ask me about Victoria Falls, nearby destinations, our activities, the live weather, places to stay or how to book. For prices and exact locations, I can connect you with our team.",
};

type ChatTurn = { role: "user" | "assistant"; text: string };

type SpeechRecognitionResult = {
  readonly isFinal: boolean;
  readonly 0?: { readonly transcript?: string };
};
type SpeechRecognitionEvent = {
  readonly resultIndex: number;
  readonly results: ArrayLike<SpeechRecognitionResult>;
};
type SpeechRecognitionErrorEvent = { readonly error: string };
type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

/** null = not tried yet; false = server has no key, so stop calling it. */
let aiAvailable: boolean | null = null;
let aiProbe: Promise<boolean> | null = null;

/** Ask the server once per page load whether a Gemini key is configured. */
function probeAssistant(): Promise<boolean> {
  if (aiAvailable !== null) return Promise.resolve(aiAvailable);
  if (!aiProbe) {
    aiProbe = fetch("/api/assistant", { cache: "no-store" })
      .then(async (res) => {
        const data = res.ok ? ((await res.json()) as { available?: unknown }) : {};
        aiAvailable = data.available === true;
        return aiAvailable;
      })
      .catch(() => {
        aiAvailable = false;
        return false;
      });
  }
  return aiProbe;
}

async function askAssistantApi(message: string, history: ChatTurn[]): Promise<string | null> {
  if (!(await probeAssistant())) return null;
  try {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal: AbortSignal.timeout(55_000),
    });
    if (res.status === 503) {
      aiAvailable = false;
      return null;
    }
    if (!res.ok) return null;
    const data = (await res.json()) as { text?: unknown };
    if (typeof data.text !== "string" || !data.text.trim()) return null;
    return data.text.trim();
  } catch {
    return null;
  }
}

/** Channel picks stay deterministic so the phone/email details are always exact. */
const CHANNEL_PICK = /^(whatsapp|call|phone|email|mail)\b/i;
const LAUNCH_MESSAGE = "Hi We Are Roar And River Safaris Ask For More Info";

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceDraftReady, setVoiceDraftReady] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const weatherRef = useRef<WeatherReport | null>(null);
  const promiseRef = useRef<Promise<WeatherReport | null> | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const recognizedTextRef = useRef("");
  const speakReplyRef = useRef(false);
  const suppressVoiceSendRef = useRef(false);
  const openRef = useRef(open);
  const idRef = useRef(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const loadWeather = useCallback((force = false): Promise<WeatherReport | null> => {
    if (!force && weatherRef.current) return Promise.resolve(weatherRef.current);
    if (promiseRef.current) return promiseRef.current;
    setLoadingWeather(true);
    const promise = getWeather(force)
      .then((data) => {
        weatherRef.current = data;
        setWeather(data);
        return data;
      })
      .finally(() => {
        setLoadingWeather(false);
        promiseRef.current = null;
      });
    promiseRef.current = promise;
    return promise;
  }, []);

  const append = useCallback((message: Omit<AssistantMessage, "id">) => {
    idRef.current += 1;
    const id = `m${idRef.current}`;
    setMessages((prev) => [...prev, { ...message, id }]);
    return id;
  }, []);

  const speakReply = useCallback((text: string) => {
    if (!openRef.current || !text.trim() || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = navigator.language || "en-US";
    window.speechSynthesis.speak(utterance);
  }, []);

  const closeAssistant = useCallback(() => {
    openRef.current = false;
    suppressVoiceSendRef.current = true;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setListening(false);
    speakReplyRef.current = false;
    window.speechSynthesis?.cancel();
    setOpen(false);
  }, []);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    },
    [],
  );

  // Fetch the forecast as soon as the panel opens, and focus the input.
  useEffect(() => {
    if (!open) return;
    void loadWeather(true);
    void probeAssistant();
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open, loadWeather]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAssistant();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeAssistant]);

  // Keep the transcript pinned to the newest message without scrolling the page.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, typing]);

  const handleSend = useCallback(
    async (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text) return;
      const speakResponse = speakReplyRef.current;
      speakReplyRef.current = false;
      setVoiceDraftReady(false);
      setVoiceError(null);
      setInput("");
      append({ role: "user", text });

      if (isSensitiveInfoQuestion(text)) {
        const reply = answer(text, weatherRef.current);
        append({ role: "assistant", ...reply });
        if (speakResponse) speakReply(reply.text);
        return;
      }

      const transactional = /\b(price|cost|how much|book|booking|reserve|reservation|availability|available|fee|usd)\b/i.test(
        text,
      );
      if (isWeatherQuestion(text) && !transactional) {
        const responseId = append({
          role: "assistant",
          text: "Checking the live Victoria Falls forecast now…",
        });
        const liveWeather = await loadWeather(true);
        const reply = answer(text, liveWeather);
        setMessages((prev) =>
          prev.map((message) =>
            message.id === responseId ? { ...message, ...reply } : message,
          ),
        );
        if (speakResponse) speakReply(reply.text);
        return;
      }

      const local = answer(text, weatherRef.current);

      // WhatsApp / Call / Email follow-ups skip the model so details stay exact.
      if (CHANNEL_PICK.test(text)) {
        append({ role: "assistant", ...local });
        if (speakResponse) speakReply(local.text);
        return;
      }

      const responseId = append({
        role: "assistant",
        text: local.text,
        actions: local.actions,
        weather: local.weather,
      });
      const history: ChatTurn[] = messages
        .filter((m) => !m.text.startsWith("One moment —"))
        .slice(-8)
        .map((m) => ({ role: m.role, text: m.text }));

      setTyping(true);
      const ai = await askAssistantApi(text, history);
      setTyping(false);

      if (ai) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === responseId ? { ...message, text: ai } : message,
          ),
        );
      }
      if (speakResponse) speakReply(ai ?? local.text);
    },
    [append, messages, input, loadWeather, speakReply],
  );

  const startVoiceInput = useCallback(() => {
    setVoiceError(null);
    setVoiceDraftReady(false);
    const browserWindow = window as SpeechRecognitionWindow;
    const Recognition =
      browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceError("Voice input isn't supported in this browser. Try Chrome or type your question.");
      return;
    }

    const recognition = new Recognition();
    const existingInput = input.trim();
    recognizedTextRef.current = "";
    suppressVoiceSendRef.current = false;
    recognition.lang = navigator.language || "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interim = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result?.[0]?.transcript?.trim() ?? "";
        if (result?.isFinal) {
          recognizedTextRef.current = `${recognizedTextRef.current} ${transcript}`.trim();
        } else {
          interim = `${interim} ${transcript}`.trim();
        }
      }
      setInput([existingInput, recognizedTextRef.current, interim].filter(Boolean).join(" "));
    };

    let recognitionFailed = false;
    recognition.onerror = (event) => {
      if (suppressVoiceSendRef.current) return;
      recognitionFailed = true;
      recognizedTextRef.current = "";
      recognitionRef.current = null;
      setListening(false);
      setVoiceError(
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Microphone access was denied. Allow microphone access in your browser settings and try again."
          : event.error === "audio-capture"
            ? "No microphone was found. Connect a microphone or type your question."
            : event.error === "no-speech"
              ? "I couldn't hear anything. Tap the microphone and try again."
              : "Voice input failed. Please try again or type your question.",
      );
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      if (suppressVoiceSendRef.current) {
        suppressVoiceSendRef.current = false;
        recognizedTextRef.current = "";
        return;
      }
      const recognized = recognizedTextRef.current.trim();
      recognizedTextRef.current = "";
      if (!recognized) {
        if (!recognitionFailed) {
          setVoiceError("I couldn't hear anything. Tap the microphone and try again.");
        }
        return;
      }

      const text = [existingInput, recognized].filter(Boolean).join(" ");
      setInput(text);
      setVoiceDraftReady(true);
    };

    try {
      recognition.start();
      setListening(true);
    } catch (error) {
      recognitionRef.current = null;
      setListening(false);
      setVoiceError(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Microphone access was denied. Allow microphone access in your browser settings and try again."
          : "Couldn't start voice input. Please try again or type your question.",
      );
    }
  }, [input]);

  const stopVoiceInput = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSend();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Roar and River Safaris assistant"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[5.75rem] right-3 z-[75] flex h-[min(70vh,560px)] w-[min(94vw,400px)] flex-col overflow-hidden rounded-[24px] border border-gold/40 bg-ivory shadow-[0_28px_80px_rgba(18,40,26,0.35)] sm:bottom-[6.5rem] sm:right-5 sm:h-[min(78vh,640px)]"
          >
            {/* Header */}
            <div className="bg-forest px-4 pb-3 pt-4 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sand">
                  <Compass className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[19px] font-bold leading-tight">River Guide</p>
                  <p className="text-[12px] text-[#b7c9b9]">Victoria Falls travel assistant</p>
                </div>
                <button
                  type="button"
                  onClick={closeAssistant}
                  aria-label="Close assistant"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Live weather strip */}
              <button
                type="button"
                onClick={() => void handleSend("What suits today's weather?")}
                className="mt-3 flex w-full items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-left text-[12.5px] text-[#e4ede3] transition-colors hover:bg-white/15"
              >
                {loadingWeather ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin text-sand" />
                    Checking the Victoria Falls forecast…
                  </>
                ) : weather ? (
                  <>
                    <span aria-hidden="true" className="text-base leading-none">
                      <WeatherSymbol code={weather.current.code} />
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      Victoria Falls · {weather.current.temp}°C · {weatherInfo(weather.current.code).label} ·{" "}
                      {weather.days[0]?.rain ?? 0}% rain
                    </span>
                    <span className="shrink-0 font-bold text-sand">What suits?</span>
                  </>
                ) : (
                  <>
                    <CloudSun className="h-4 w-4 text-sand" />
                    <span className="min-w-0 flex-1 truncate">Live forecast unavailable</span>
                    <span className="shrink-0 font-bold text-sand">Retry</span>
                  </>
                )}
              </button>
            </div>

            {/* Transcript */}
            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#f4eedd] px-3.5 py-4"
            >
              {messages.map((m) => (
                <Message key={m.id} message={m} onSend={(text) => void handleSend(text)} />
              ))}

              {messages.length === 1 && (
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {ASSISTANT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void handleSend(s)}
                      className="rounded-full border border-forest/15 bg-white/80 px-4 py-2 text-left text-[13px] font-bold text-forest transition-colors hover:border-gold hover:bg-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {typing && (
                <div className="flex max-w-[88%] items-center gap-2.5 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3">
                  <span className="text-[13px] font-bold text-muted">River Guide is thinking</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" />
                  </span>
                </div>
              )}
            </div>

            {/* Composer */}
            <form onSubmit={submit} className="border-t border-line bg-ivory p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-white px-3 py-1.5 transition-colors focus-within:border-gold">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about tours, weather or booking…"
                  aria-label="Message the assistant"
                  className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-forest outline-none placeholder:text-muted/70"
                />
                <div className="group/microphone relative mb-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (listening) {
                        stopVoiceInput();
                      } else if (voiceDraftReady && input.trim()) {
                        speakReplyRef.current = true;
                        void handleSend(input);
                      } else {
                        startVoiceInput();
                      }
                    }}
                    aria-label={
                      listening
                        ? "Stop recording"
                        : voiceDraftReady
                          ? "Tap again to send voice message"
                          : "Record a voice message"
                    }
                    aria-pressed={listening}
                    title={
                      listening
                        ? "Stop recording"
                        : voiceDraftReady
                          ? "Tap again to send"
                          : "Record a voice message"
                    }
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                      listening
                        ? "animate-pulse bg-red-100 text-red-700 hover:bg-red-200"
                        : voiceDraftReady
                          ? "bg-gold/20 text-forest hover:bg-gold/30"
                          : "bg-cream text-forest hover:bg-gold/20",
                    )}
                  >
                    {listening ? (
                      <MicOff className="h-4.5 w-4.5" strokeWidth={2.2} />
                    ) : (
                      <Mic className="h-4.5 w-4.5" strokeWidth={2.2} />
                    )}
                  </button>
                  {voiceDraftReady && !listening && (
                    <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-forest px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow transition-opacity group-hover/microphone:opacity-100 group-focus-within/microphone:opacity-100">
                      Tap again to send
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-white transition-colors hover:bg-forest-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowUp className="h-4.5 w-4.5" strokeWidth={2.4} />
                </button>
              </div>
              {(listening || voiceError) && (
                <p
                  role={voiceError ? "alert" : "status"}
                  aria-live="polite"
                  className={cn(
                    "mt-2 text-center text-xs",
                    voiceError ? "text-red-700" : "text-forest",
                  )}
                >
                  {voiceError ?? "Listening… Speak now, then tap the microphone to finish."}
                </p>
              )}
              {voiceDraftReady && !voiceError && (
                <p role="status" aria-live="polite" className="mt-2 text-center text-xs text-forest">
                  Check the transcript, then tap the microphone again to send.
                </p>
              )}
              <p className="mt-1.5 text-center text-[10.5px] leading-snug text-muted">
                Tour info from this site · Weather by{" "}
                <a
                  href="https://open-meteo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-forest"
                >
                  Open-Meteo
                </a>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (open) {
            closeAssistant();
            return;
          }

          openRef.current = true;
          setOpen(true);
          void handleSend(LAUNCH_MESSAGE);
        }}
        aria-expanded={open}
        aria-label={open ? "Close River Guide assistant" : "Open River Guide assistant"}
        title="Ask the River Guide"
        className="assistant-launcher group fixed bottom-5 right-4 z-[80] flex h-14 w-14 items-center justify-center overflow-visible rounded-full bg-forest text-white shadow-[0_14px_34px_rgba(18,40,26,0.4)] ring-2 ring-sand/60 transition-colors hover:bg-forest-soft sm:right-6 sm:h-16 sm:w-16"
      >
        <span className="pointer-events-none absolute bottom-full right-0 mb-2 w-max max-w-[min(16rem,calc(100vw-2rem))] rounded-2xl border border-line bg-white/95 px-3 py-2 text-left text-[11px] font-medium leading-snug text-forest opacity-0 shadow-[0_10px_28px_rgba(18,40,26,0.12)] backdrop-blur-sm transition-all duration-200 group-hover:opacity-100">
          {LAUNCH_MESSAGE}
        </span>

        <span className="absolute inset-0 overflow-hidden rounded-full">
          <Image
            src="/images/assistant-mascot.jpg"
            alt=""
            width={736}
            height={552}
            quality={100}
            className="assistant-launcher-icon h-full w-full object-cover"
          />
        </span>
      </button>
    </>
  );
}

function Message({ message, onSend }: { message: AssistantMessage; onSend: (text: string) => void }) {
  const user = message.role === "user";
  return (
    <div className={cn("flex", user ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-4 py-3 text-[14.5px] leading-[1.6]",
          user
            ? "rounded-br-md bg-forest text-white"
            : "rounded-bl-md border border-line bg-white text-forest shadow-[0_6px_18px_rgba(30,40,30,0.06)]",
        )}
      >
        <p className="whitespace-pre-line break-words">{message.text}</p>

        {message.weather && <WeatherCard weather={message.weather} />}

        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {message.actions.map((a) => (
              <ActionChip key={a.label} action={a} onSend={onSend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionChip({ action, onSend }: { action: AssistantAction; onSend: (text: string) => void }) {
  const primary = action.label.startsWith("Book ") || action.label === "Open booking form";
  const cls = cn(
    "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[12.5px] font-bold transition-colors",
    primary
      ? "bg-forest text-white hover:bg-forest-soft"
      : "border border-forest/20 bg-white text-forest hover:border-gold hover:bg-ivory",
  );

  if (action.send) {
    return (
      <button type="button" onClick={() => onSend(action.send!)} className={cls}>
        {action.label}
      </button>
    );
  }

  const href = action.href ?? "/";
  const external =
    action.external === true || /^(https?:|tel:|mailto:)/.test(href);

  if (external) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {action.label}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {action.label}
    </Link>
  );
}

function WeatherCard({ weather }: { weather: WeatherReport }) {
  const updated = new Date(weather.fetchedAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="mt-3 rounded-xl border border-line bg-cream/70 p-2.5">
      <div className="flex gap-1.5">
        {weather.days.slice(0, 5).map((d) => {
          const info = weatherInfo(d.code);
          const label = new Date(`${d.date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short" });
          return (
            <div
              key={d.date}
              className="min-w-0 flex-1 rounded-lg bg-white/80 px-1 py-1.5 text-center"
              title={`${label}: ${info.label}, ${d.min}–${d.max}°C, ${d.rain}% rain`}
            >
              <p className="text-[9.5px] font-bold uppercase tracking-wide text-muted">{label}</p>
              <p className="text-[15px] leading-tight" aria-hidden="true">
                <WeatherSymbol code={d.code} />
              </p>
              <p className="text-[11.5px] font-bold text-forest">{d.max}°</p>
              <p className="text-[9.5px] text-muted">{d.rain}%</p>
            </div>
          );
        })}
      </div>
      <p className="mt-1.5 text-[9.5px] text-muted">
        5-day forecast, updated {updated} · Open-Meteo
      </p>
    </div>
  );
}

function WeatherSymbol({ code }: { code: number }) {
  if (code !== 0) return weatherInfo(code).emoji;

  return (
    <span className="inline-flex h-4 w-4 overflow-hidden rounded-full align-[-3px]">
      <Image
        src="/images/weather/sunny-circle.png"
        alt=""
        width={32}
        height={32}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
