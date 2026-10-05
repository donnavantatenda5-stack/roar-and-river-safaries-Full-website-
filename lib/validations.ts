import { z } from "zod";

const today = () => new Date().toISOString().slice(0, 10);

export const bookingSchema = z.object({
  tour_id: z.string().min(1, "Please choose a tour"),
  full_name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(254),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone / WhatsApp number")
    .max(20, "That number looks too long"),
  travel_date: z
    .string()
    .min(1, "Choose a date")
    .refine((v) => v >= today(), "The date can't be in the past"),
  group_size: z
    .number({ error: "Enter the number of people" })
    .int("Whole numbers only")
    .min(1, "At least 1 person")
    .max(50, "For groups over 50, please message us"),
  message: z.string().trim().max(1000, "Keep it under 1000 characters").optional(),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
