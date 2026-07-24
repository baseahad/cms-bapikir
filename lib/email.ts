import { Resend } from "resend";
import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { siteConfig } from "@/config/site";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_FROM = process.env.EMAIL_FROM ?? `${siteConfig.name} <noreply@example.com>`;

type SendEmailParams = {
  to: string;
  subject: string;
  react: ReactElement;
};

export async function sendEmail({ to, subject, react }: SendEmailParams) {
  const html = await render(react);

  const { data, error } = await resend.emails.send({
    from: DEFAULT_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
