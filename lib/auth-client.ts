"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client";
import type { auth } from "@/lib/auth"; // type-only to avoid pulling server code into client bundle

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  plugins: [inferAdditionalFields<typeof auth>()],
});
