import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Verifica se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rotas que requerem autenticação
  const authRoutes = ["/perfil"];
  const adminRoutes = ["/admin"];

  // Verifica se é uma rota administrativa
  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Verifica se é uma rota que requer autenticação
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Se for rota admin, verifica se o usuário é admin
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Busca os metadados do usuário para verificar se é admin
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Se for rota autenticada normal, verifica se o usuário está logado
  if (isAuthRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return res;
}

// Specify which routes to run the middleware on
export const config = {
  matcher: ["/perfil/:path*", "/admin/:path*"],
};
