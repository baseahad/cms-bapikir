import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Lupa Password — CMS Bapikir",
  description: "Minta link untuk mengatur ulang password akun kamu.",
  path: "/auth/forgot-password",
  noIndex: true,
});

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
