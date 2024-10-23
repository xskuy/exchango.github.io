import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  // Rutas que no requieren autenticación
  const publicPaths = ['/auth/login-page', '/signup', '/forgot-password']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Si el usuario está autenticado y trata de acceder a una ruta pública
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/main', request.url))
  }

  // Si el usuario no está autenticado y trata de acceder a una ruta protegida
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/login-page', request.url))
  }

  // Si el usuario está autenticado y accede a la raíz
  if (session && pathname === '/') {
    return NextResponse.redirect(new URL('/main', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
