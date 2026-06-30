import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

/**
 * Get the current session on the server side.
 * Use in Server Components, API routes, or Route Handlers.
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if the current user is authenticated.
 * Returns the session if authenticated, null otherwise.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return session;
}

/**
 * Check if the current user is an admin.
 * Returns the session if admin, null otherwise.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

/**
 * API route helper: returns 401 response if not authenticated
 */
export function unauthorizedResponse(message = "Authentication required") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * API route helper: returns 403 response if not admin
 */
export function forbiddenResponse(message = "Admin access required") {
  return NextResponse.json({ error: message }, { status: 403 });
}
