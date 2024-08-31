import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token");

  const loginPath = "/login";
  const userDashboardPath = "/"; // Path untuk user biasa
  const adminDashboardPath = "/admin/dashboard"; // Path untuk admin

  if (token) {
    try {
      // Verifikasi token untuk memastikan token masih valid
      const { payload } = await jwtVerify(token.value, new TextEncoder().encode("your-very-strong-secret-key-1234567890"));

      // Periksa peran pengguna dari payload token
      const userRole = payload.role;

      // Jika user sudah login dan mencoba mengakses /login, redirect ke dashboard sesuai peran
      if (req.nextUrl.pathname === loginPath) {
        if (userRole === "admin") {
          return NextResponse.redirect(new URL(adminDashboardPath, req.url));
        } else {
          return NextResponse.redirect(new URL(userDashboardPath, req.url));
        }
      }

      // Jika admin mengakses halaman selain /admin, biarkan akses
      if (userRole === "admin" && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.next();
      }

      // Jika user biasa mencoba mengakses halaman admin, redirect ke halaman utama
      if (userRole !== "admin" && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL(userDashboardPath, req.url));
      }

      // Jika token valid dan user memiliki akses, biarkan request berlanjut
      return NextResponse.next();
    } catch (error) {
      console.error("Token invalid:", error);
      // Jika token tidak valid, redirect ke login
      return NextResponse.redirect(new URL(loginPath, req.url));
    }
  } else {
    // Jika tidak ada token dan user mencoba mengakses halaman dilindungi, redirect ke login
    if (req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL(loginPath, req.url));
    }

    // Jika tidak ada token dan user mencoba mengakses halaman login, biarkan request berlanjut
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/login", "/admin/:path*"], // Middleware ini akan berjalan di /login dan semua route di bawah /admin
};
