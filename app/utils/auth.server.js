import { prisma } from "./prisma.server";
import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { createUser } from "./user.server";
import bcrypt from "bcryptjs";
import logger from "./logger"; // Import the logger

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  logger.error("SESSION_SECRET must be set");
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
  try {
    const exists = await prisma.user.count({ where: { email: user.email } });
    if (exists) {
      logger.warn(
        `Registration attempt failed: User with email ${user.email} already exists.`
      );
      return json(
        { errors: { form: `User already exists with that email` } },
        { status: 400 }
      );
    }

    const newUser = await createUser(user);
    if (!newUser) {
      logger.error(`Failed to create a new user: ${user.email}`);
      return json(
        {
          errors: { form: `Something went wrong trying to create a new user.` },
          fields: { email: user.email, password: user.password },
        },
        { status: 400 }
      );
    }

    logger.info(`New user registered: ${newUser.email}`);
    return createUserSession(newUser.id, "/");
  } catch (error) {
    logger.error(`Error during registration: ${error.message}`);
    throw error;
  }
}

export async function login({ email, password, remember }) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn(`Login attempt failed for email: ${email}`);
      return json(
        { errors: { email: null, password: null, form: `Incorrect login` } },
        { status: 400 }
      );
    }

    logger.info(`User logged in: ${email}`);
    return createUserSession(user.id, "/", remember);
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    throw error;
  }
}

export async function createUserSession(userId, redirectTo, remember) {
  try {
    const session = await storage.getSession();
    session.set("userId", userId);
    logger.info(`Created session for userId: ${userId}`);
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await storage.commitSession(session, {
          maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 7 days
        }),
      },
    });
  } catch (error) {
    logger.error(
      `Error creating session for userId: ${userId} - ${error.message}`
    );
    throw error;
  }
}

export async function requireUserId(
  request,
  redirectTo = new URL(request.url).pathname
) {
  try {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "number") {
      logger.warn(`Unauthorized access attempt, redirecting to login.`);
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/login?${searchParams}`);
    }
    logger.info(`Authorized access for userId: ${userId}`);
    return userId;
  } catch (error) {
    logger.error(`Error in requireUserId: ${error.message}`);
    throw error;
  }
}

function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}

async function getUserId(request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "number") {
    logger.warn(`Failed to retrieve userId from session.`);
    return null;
  }
  logger.info(`Retrieved userId: ${userId}`);
  return userId;
}

export async function getUser(request) {
  const userId = await getUserId(request);
  if (typeof userId !== "number") {
    logger.warn(`User not found in session, returning null.`);
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    logger.info(`Fetched user details: ${user.email}`);
    return user;
  } catch (error) {
    logger.error(`Error fetching user: ${error.message}`);
    throw logout(request);
  }
}

export async function logout(request) {
  try {
    const session = await getUserSession(request);
    logger.info(`Logging out user, destroying session.`);
    return redirect("/login", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  } catch (error) {
    logger.error(`Error during logout: ${error.message}`);
    throw error;
  }
}
