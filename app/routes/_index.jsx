import React from "react";
import { getUser, requireUserId } from "../utils/auth.server";
import { redirect } from "@remix-run/react";

export const loader = async ({ request }) => {
  await requireUserId(request);
  // Check if the user is logged in
  const user = await getUser(request);

  // If the user is logged in, redirect them to the dashboard
  if (user) {
    return redirect("/dashboard");
  }
  return null;
};

const Index = () => {
  return <div>Welcome to Article Category App.</div>;
};

export default Index;
