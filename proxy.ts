import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";
import { evaluateGate } from "@/lib/license/gate";

export async function proxy(request: NextRequest) {
  // License gate (BSL): in production on a public host, gated routes need a
  // valid key. Limited mode redirects gated pages to /admin/license and 403s
  // gated APIs. Read-only/public routes and the status page are never gated.
  const gate = await evaluateGate(request);
  if (gate.action === "redirect") {
    return NextResponse.redirect(new URL(gate.to, request.url));
  }
  if (gate.action === "block") {
    return new NextResponse(gate.body, {
      status: 403,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
