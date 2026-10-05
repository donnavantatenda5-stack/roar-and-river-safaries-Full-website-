"use server";

import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { bookingSchema, type BookingInput } from "@/lib/validations";

export type BookingResult = { ok: true } | { ok: false; error: string };

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  const d = parsed.data;

  // Bots fill the hidden field; pretend it worked and do nothing.
  if (d.website) return { ok: true };

  // No .select() here on purpose: visitors may insert bookings but never read them.
  const { error } = await supabase.from("bookings").insert({
    tour_id: d.tour_id,
    full_name: d.full_name,
    email: d.email,
    phone: d.phone,
    travel_date: d.travel_date,
    group_size: d.group_size,
    message: d.message || null,
  });

  if (error) {
    console.error("Booking insert failed:", error.message);
    return { ok: false, error: "Sorry, we couldn't save your booking. Please try again or message us on WhatsApp." };
  }

  // The booking is saved. The email alert is best-effort and must never fail the request.
  try {
    const { RESEND_API_KEY, RESEND_FROM_EMAIL, BOOKING_NOTIFY_EMAIL } = process.env;
    if (RESEND_API_KEY && RESEND_FROM_EMAIL && BOOKING_NOTIFY_EMAIL) {
      const { data: tour } = await supabase
        .from("tours")
        .select("name")
        .eq("id", d.tour_id)
        .single();
      const tourName = tour?.name ?? "Unknown tour";

      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: BOOKING_NOTIFY_EMAIL,
        replyTo: d.email,
        subject: `New booking: ${tourName} - ${d.full_name}`,
        text: [
          `Tour: ${tourName}`,
          `Name: ${d.full_name}`,
          `Email: ${d.email}`,
          `Phone / WhatsApp: ${d.phone}`,
          `Travel date: ${d.travel_date}`,
          `Group size: ${d.group_size}`,
          `Message: ${d.message || "-"}`,
        ].join("\n"),
      });
    }
  } catch (e) {
    console.error("Booking email failed:", e);
  }

  return { ok: true };
}
