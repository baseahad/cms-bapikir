import type { DbEnum } from "@/types/database";

export type SubscriptionPlan = DbEnum<"plan">;
export type PaidPlan = Exclude<SubscriptionPlan, "FREE">;

export type PaymentLineItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type SubscriptionPlanDefinition = {
  aiMonthlyTokens: number | null;
  description: string;
  features: string[];
  intervalLabel: string;
  items: PaymentLineItem[];
  plan: PaidPlan;
  price: number;
  title: string;
};

export const planLabels: Record<SubscriptionPlan, string> = {
  FREE: "Gratis",
  BASIC: "Basic",
  PRO: "Pro",
  ULTIMATE: "Ultimate",
};

export const paidPlanCatalog: Record<PaidPlan, SubscriptionPlanDefinition> = {
  BASIC: {
    aiMonthlyTokens: 10_000,
    description: "Untuk mulai ship lebih cepat dengan fitur inti produk.",
    features: [
      "10K token AI per bulan",
      "Dashboard dan billing",
      "Riwayat pembayaran",
      "Email transaksional dasar",
    ],
    intervalLabel: "/bulan",
    items: [
      {
        id: "basic-monthly",
        name: "Basic - 1 Bulan",
        price: 49_000,
        quantity: 1,
      },
    ],
    plan: "BASIC",
    price: 49_000,
    title: "Basic",
  },
  PRO: {
    aiMonthlyTokens: 100_000,
    description: "Plan utama untuk produk yang sudah aktif dipakai customer.",
    features: [
      "Semua fitur Free",
      "100K token AI per bulan",
      "Transfer manual (MALIYA CENTER)",
      "Email transaksional (Resend)",
      "Admin dashboard",
      "Prioritas support",
    ],
    intervalLabel: "/bulan",
    items: [
      {
        id: "pro-monthly",
        name: "Pro - 1 Bulan",
        price: 99_000,
        quantity: 1,
      },
    ],
    plan: "PRO",
    price: 99_000,
    title: "Pro",
  },
  ULTIMATE: {
    aiMonthlyTokens: null,
    description: "Untuk tim yang ingin fleksibilitas penuh dan limit minimum.",
    features: [
      "Semua fitur Pro",
      "Token AI tak terbatas",
      "Custom model allowlist",
      "Prioritas support tertinggi",
    ],
    intervalLabel: "/bulan",
    items: [
      {
        id: "ultimate-monthly",
        name: "Ultimate - 1 Bulan",
        price: 299_000,
        quantity: 1,
      },
    ],
    plan: "ULTIMATE",
    price: 299_000,
    title: "Ultimate",
  },
};

export const paidPlans = Object.values(paidPlanCatalog);
export const defaultPaidPlan = paidPlanCatalog.PRO;

export function getPaidPlan(plan: string): SubscriptionPlanDefinition | null {
  if (!(plan in paidPlanCatalog)) {
    return null;
  }

  return paidPlanCatalog[plan as PaidPlan];
}

export function getPlanPeriodEnd(start: Date) {
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return end;
}
