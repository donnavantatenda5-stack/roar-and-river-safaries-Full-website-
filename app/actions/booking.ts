"use server";

import { supabase } from "@/lib/supabase";
import { isMailConfigured, sendBookingAlert } from "@/lib/mailer";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { getActivity } from "@/lib/activities";

export type BookingResult = { ok: true } | { ok: false; error: string };

async function lookupTourName(tourId: string): Promise<string> {
  try {
    const { data } = await supabase.from("tours").select("name").eq("id", tourId).single();
    if (data?.name) return data.name;
  } catch {
    // fall through to the activity lookup below
  }
  return getActivity(tourId)?.name ?? "Unknown tour";
}

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  const d = parsed.data;

  // Bots fill the hidden field; pretend it worked and do nothing.
  if (d.website) return { ok: true };

  const activity = getActivity(d.tour_id);
  const { error } = activity
    ? await supabase.from("leads").insert({
        name: d.full_name,
        email: d.email,
        dates: d.travel_date,
        group_size: d.group_size,
        interested_tour: activity.name,
        phone: d.phone,
        message: d.message || null,
      })
    : await supabase.from("bookings").insert({
        tour_id: d.tour_id,
        full_name: d.full_name,
        email: d.email,
        phone: d.phone,
        travel_date: d.travel_date,
        group_size: d.group_size,
        message: d.message || null,
      });

  if (error) console.error(activity ? "Activity enquiry insert failed:" : "Booking insert failed:", error.message);

  // Alert the operator - also when the insert failed, so a booking that only
  // lives in this email is never silently lost. Best-effort, never fails the request.
  if (isMailConfigured()) {
    try {
      const result = await sendBookingAlert({
        tourName: await lookupTourName(d.tour_id),
        name: d.full_name,
        email: d.email,
        phone: d.phone,
        travelDate: d.travel_date,
        groupSize: d.group_size,
        message: d.message || null,
        dbSaved: !error,
      });
      if (!result.sent) console.error("Booking email not sent:", result.error);
    } catch (e) {
      console.error("Booking email failed:", e);
    }
  }

  if (error) {
    return { ok: false, error: "Sorry, we couldn't save your booking. Please try again or message us on WhatsApp." };
  }

  return { ok: true };
}
