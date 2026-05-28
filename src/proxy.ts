import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: [
    "/browse/:path*",
    "/profiles/:path*",
    "/watch/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
