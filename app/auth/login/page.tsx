import { LoginForm } from "@/components/login-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Login — CMS Bapikir",
  description: "Masuk ke akun CMS Bapikir.",
  path: "/auth/login",
  noIndex: true,
});

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
