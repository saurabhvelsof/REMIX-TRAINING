import { prisma } from "./prisma.server";
import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { createUser } from "./user.server";
import bcrypt from "bcryptjs";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "my-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function register(user) {
  const exists = await prisma.user.count({ where: { email: user.email } });
  if (exists) {
    return json(
      { errors: { form: `User already exists with that email` } },
      { status: 400 }
    );
  }

  const newUser = await createUser(user);
  if (!newUser) {
    return json(
      {
        errors: { form: `Something went wrong trying to create a new user.` },
        fields: { email: user.email, password: user.password },
      },
      { status: 400 }
    );
  }

  return createUserSession(newUser.id, "/");
}

export async function login({ email, password, remember }) {
  console.log(email, password, remember);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    console.log("Incorrect login");
    return json(
      { errors: { email: null, password: null, form: `Incorrect login` } },
      { status: 400 }
    );
  }

  //   return { id: user.id, email };
  return createUserSession(user.id, "/", remember);
}

export async function createUserSession(userId, redirectTo, remember) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function requireUserId(
  request,
  redirectTo = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}

async function getUserId(request) {
  const session = await getUserSession(request);
  // console.log("session", session);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") return null;
  return userId;
}

export async function getUser(request) {
  const userId = await getUserId(request);
  if (typeof userId !== "number") {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
