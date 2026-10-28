import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { devPreview } from "@/lib/dev-preview";

export async function middleware(request: NextRequest) {
  if (devPreview) return NextResponse.next({ request });

  // Supabase redirige a la Site URL con ?error_code=... cuando el enlace del correo falla.
  if (request.nextUrl.pathname === "/") {
    if (!request.nextUrl.searchParams.has("error_code")) return NextResponse.next({ request });
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?error=${request.nextUrl.searchParams.get("error_code") === "otp_expired" ? "expired" : "invalid"}`;
    return NextResponse.redirect(url);
  }
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/app")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/", "/app/:path*", "/login"],
};
