import { withAuth } from "next-auth/middleware";

export default withAuth({
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
