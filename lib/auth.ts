import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db, mongoClient } from "./db";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(), // must be last so server actions can set cookies
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
      },
    },
  },
});
