import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Proteger todo excepto rutas públicas de Clerk
    "/((?!_next|favicon.ico|sign-up|forgot-password|api|\\[\\[...rest\\]\\]|/$).*)",
    // Siempre proteger rutas de API si las tienes aquí
    // "/(api|trpc)(.*)",
  ],
};
