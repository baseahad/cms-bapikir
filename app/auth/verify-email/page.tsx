import { createMetadata } from "@/lib/seo";
import { VerifyEmailClient } from "./verify-email-client";

export const metadata = createMetadata({
  title: "Verifikasi Email — CMS Bapikir",
  description: "Periksa inbox kamu untuk menyelesaikan verifikasi akun.",
  path: "/auth/verify-email",
  noIndex: true,
});

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
}
