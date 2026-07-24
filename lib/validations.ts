import { z } from "zod";

export const paymentRequestSchema = z.object({
  plan: z.enum(["BASIC", "PRO", "ULTIMATE"]),
});

export const contactRequestSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  message: z.string().trim().min(1),
});

// Nomor WA Indonesia -> format lokal (+62xxx / 62xxx / 0xxx semuanya jadi 0xxx),
// supaya satu orang tak tersimpan dua kali dengan format berbeda.
export function normalizeWa(input: string) {
  const digits = input.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+62")) return `0${digits.slice(3)}`;
  if (digits.startsWith("62")) return `0${digits.slice(2)}`;
  return digits;
}

export const waitlistRequestSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  name: z.string().trim().min(2).max(100),
  wa: z
    .string()
    .trim()
    .transform(normalizeWa)
    .refine((v) => /^0\d{8,14}$/.test(v), "Nomor WhatsApp tidak valid."),
});

export const subscriptionManageRequestSchema = z.object({
  action: z.enum(["cancel", "resume"]),
});

export const adminRoleUpdateRequestSchema = z.object({
  role: z.enum(["member", "admin"]),
  user_id: z.string().trim().uuid(),
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda strip"),
  description: z.string().trim().max(500).optional().default(""),
  content: z.string().trim().min(1, "Konten wajib diisi"),
  author: z.string().trim().max(100).optional().default("Avathur Rahman"),
  tags: z.array(z.string().trim()).optional().default([]),
  category: z.string().trim().optional().default(""),
  access: z.enum(["free", "member", "premium", "exclusive"]).optional().default("free"),
  published: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  cover_image: z.string().trim().optional().default(""),
});

export const profileUpdateRequestSchema = z.object({
  avatar_path: z.string().trim().max(255).or(z.literal("")).optional(),
  avatar_url: z
    .string()
    .trim()
    .url()
    .or(z.literal(""))
    .optional(),
  full_name: z.string().trim().max(100).optional(),
  sapaan: z.enum(["salam", "halo"]).optional(),
});

export const aiGenerateRequestSchema = z.object({
  prompt: z.string().trim().min(1),
  system: z.string().trim().min(1).optional(),
  provider: z.enum(["openai", "anthropic", "google"]).optional(),
});

export const aiChatRequestSchema = z.object({
  messages: z.array(z.object({}).passthrough()),
  provider: z.enum(["openai", "anthropic", "google"]).optional(),
});

export const manualPaymentProofSchema = z.object({
  order_id: z.string().trim().min(1),
  bukti_path: z.string().trim().min(1),
  bank: z.string().trim().max(50).optional(),
  nama_pengirim: z.string().trim().max(100).optional(),
  tanggal_transfer: z.string().trim().max(20).optional(),
});
