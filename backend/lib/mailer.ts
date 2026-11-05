import nodemailer from "nodemailer";
import { Resend } from "resend";

export type BookingAlert = {
  tourName: string;
  name: string;
  email: string;
  phone: string;
  travelDate: string;
  groupSize: number;
  message?: string | null;
  dbSaved: boolean;
};

export type MailResult = { sent: boolean; via?: "smtp" | "resend"; error?: string };

const bool = (v?: string) => Boolean(v && v.trim());

export function isSmtpConfigured() {
  return bool(process.env.SMTP_USER) && bool(process.env.SMTP_PASS);
}

export function isResendConfigured() {
  const key = process.env.RESEND_API_KEY;
  return bool(key) && bool(process.env.RESEND_FROM_EMAIL) && !key!.trim().startsWith("re_xxxx");
}

export function isMailConfigured() {
  return isSmtpConfigured() || isResendConfigured();
}

function render(a: BookingAlert) {
  const subject = `New booking from ${a.email}: ${a.tourName}${a.dbSaved ? "" : " [DB SAVE FAILED]"}`;
  const text = [
    `Name: ${a.name}`,
    `Email: ${a.email}`,
    `Tour: ${a.tourName}`,
    `Phone / WhatsApp: ${a.phone}`,
    `Travel date: ${a.travelDate}`,
    `Group size: ${a.groupSize}`,
    `Message: ${a.message || "-"}`,
    "",
    a.dbSaved
      ? "Saved to the bookings database."
      : "WARNING: the database insert failed - this booking exists only in this email.",
  ].join("\n");
  return { subject, text };
}

/**
 * Best-effort booking alert. Prefers Gmail SMTP (so the message lands in the
 * real Inbox and a copy stays in Sent), falls back to Resend when only that
 * is configured. Never throws.
 */
export async function sendBookingAlert(a: BookingAlert): Promise<MailResult> {
  const to = process.env.BOOKING_NOTIFY_EMAIL?.trim();
  if (!to) return { sent: false, error: "BOOKING_NOTIFY_EMAIL is not set" };

  const { subject, text } = render(a);
  const replyTo = a.email;

  if (isSmtpConfigured()) {
    try {
      const port = Number(process.env.SMTP_PORT || 587);
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER!.trim(), pass: process.env.SMTP_PASS!.trim() },
      });
      await transport.sendMail({
        // Gmail requires the sender address to be your own account; the visitor's
        // name + email (subject + reply-to + body) make clear who it's from so
        // pressing Reply in Gmail reaches them directly.
        from: `"${a.name}" <${process.env.SMTP_USER!.trim()}>`,
        to,
        replyTo,
        subject,
        text,
      });
      return { sent: true, via: "smtp" };
    } catch (e) {
      console.error("SMTP booking alert failed:", e);
      if (!isResendConfigured()) return { sent: false, error: "smtp send failed" };
    }
  }

  if (isResendConfigured()) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY!.trim());
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!.trim(),
        to,
        replyTo,
        subject,
        text,
      });
      return { sent: true, via: "resend" };
    } catch (e) {
      console.error("Resend booking alert failed:", e);
      return { sent: false, error: "resend send failed" };
    }
  }

  return { sent: false, error: "no mail transport configured" };
}
