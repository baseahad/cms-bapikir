import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  // Hapus semua cookie Supabase auth dengan expired di masa lalu
  // Cookie names yang umum dipake @supabase/ssr
  const cookieNames = [
    "sb-vjkukjuzsoijutvgxvof-auth-token",
    "sb-vjkukjuzsoijutvgxvof-auth-token-code-verifier",
    "supabase-auth-token",
    "sb-refresh-token",
    "sb-access-token",
  ];

  for (const name of cookieNames) {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0, // expired
    });
  }

  return response;
}
