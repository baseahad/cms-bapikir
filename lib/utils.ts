import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Guard: cek apakah Supabase public env tersedia
// Dipanggil sebagai fungsi (bukan module-level const) agar nilai
// dievaluasi ulang di server vs client — mencegah hydration mismatch.
export function hasEnvVars() {
  return Boolean(
    typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  );
}
