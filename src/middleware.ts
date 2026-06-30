import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // If token exists, they are authenticated. For admin pages, check role.
      return token?.role === "ADMIN";
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
