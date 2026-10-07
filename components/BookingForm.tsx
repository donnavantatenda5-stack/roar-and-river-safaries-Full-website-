"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createBooking } from "@/app/actions/booking";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { formatPrice, type Tour } from "@/lib/types";

const field =
  "w-full rounded-xl border border-[#e8e1d0] bg-white px-4 py-3 text-[15px] text-[#12281A] outline-none transition focus:border-[#B08D4F] focus:ring-2 focus:ring-[#B08D4F]/30";
const label = "mb-1.5 block text-sm font-semibold text-[#12281A]";
const err = "mt-1 text-sm text-red-600";

export default function BookingForm({
  tours,
  defaultTourId,
}: {
  tours: Tour[];
  defaultTourId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const successRef = useRef<HTMLDivElement | null>(null);

  // On phones the form sits far down the single-column page; bring the success
  // message on screen the same way the desktop sees it (the form card is sticky).
  useEffect(() => {
    if (!done) return;
    successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [done]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { tour_id: defaultTourId ?? "", group_size: 2 },
  });

  const onSubmit = (values: BookingInput) => {
    setServerError(null);
    startTransition(async () => {
      const res = await createBooking(values);
      if (res.ok) {
        setDone(true);
        reset();
      } else {
        setServerError(res.error);
      }
    });
  };

  if (done) {
    return (
      <div
        ref={successRef}
        className="rounded-2xl border border-[#e8e1d0] bg-white p-10 text-center shadow-sm"
      >
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#B08D4F]" />
        <h2 className="text-2xl font-semibold text-[#12281A]">Booking request received</h2>
        <p className="mt-2 text-[#5c625f]">
          Thank you! We&apos;ll contact you shortly to confirm your adventure.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-6 rounded-full bg-[#12281A] px-6 py-3 text-sm font-semibold text-white"
        >
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl border border-[#e8e1d0] bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label className={label} htmlFor="tour_id">Tour</label>
        <select id="tour_id" className={field} {...register("tour_id")}>
          <option value="">Choose a tour...</option>
          {tours.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} - {formatPrice(t.price_usd)}
            </option>
          ))}
        </select>
        {errors.tour_id && <p className={err}>{errors.tour_id.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="full_name">Full name</label>
          <input id="full_name" className={field} autoComplete="name" {...register("full_name")} />
          {errors.full_name && <p className={err}>{errors.full_name.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" type="email" className={field} autoComplete="email" {...register("email")} />
          {errors.email && <p className={err}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="phone">Phone / WhatsApp</label>
          <input id="phone" type="tel" className={field} autoComplete="tel" {...register("phone")} />
          {errors.phone && <p className={err}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="travel_date">Travel date</label>
          <input id="travel_date" type="date" className={field} {...register("travel_date")} />
          {errors.travel_date && <p className={err}>{errors.travel_date.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="group_size">People</label>
          <input
            id="group_size"
            type="number"
            min={1}
            max={50}
            className={field}
            {...register("group_size", { valueAsNumber: true })}
          />
          {errors.group_size && <p className={err}>{errors.group_size.message}</p>}
        </div>
      </div>

      <div>
        <label className={label} htmlFor="message">Message (optional)</label>
        <textarea id="message" rows={4} className={field} {...register("message")} />
        {errors.message && <p className={err}>{errors.message.message}</p>}
      </div>

      {/* Honeypot - hidden from people, visible to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {serverError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#12281A] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#1c3a28] disabled:opacity-60"
      >
        {pending && <Loader2 className="h-5 w-5 animate-spin" />}
        {pending ? "Sending..." : "Request booking"}
      </button>
    </form>
  );
}
