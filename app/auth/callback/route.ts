import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const type = requestUrl.searchParams.get("type");

    console.log("Auth callback params:", { code: !!code, type });

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        throw error;
      }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL("/", requestUrl.origin));
  } catch (error) {
    console.error("Auth callback error:", error);
    // Em caso de erro, redireciona para login com mensagem de erro
    return NextResponse.redirect(
      new URL("/login?error=auth_callback_failed", request.url)
    );
  }
}
