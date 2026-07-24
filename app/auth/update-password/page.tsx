import { UpdatePasswordForm } from "@/components/update-password-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Update Password — CMS Bapikir",
  description: "Atur password baru untuk akun kamu.",
  path: "/auth/update-password",
  noIndex: true,
});

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
