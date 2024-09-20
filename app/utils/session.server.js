// session.server.js
import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

// You can set the cookie options here (change "name", "secrets" as needed)
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "my_session", // Name of the cookie
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret], // Make sure to add your secrets in env
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
