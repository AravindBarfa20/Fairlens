// frontend/src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public: landing, sandbox, API routes (streaming must not require cookie)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sandbox",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/report(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
