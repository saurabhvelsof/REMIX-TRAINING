import { redirect } from "@remix-run/node";
import { logout } from "../utils/auth.server"; // Import the logout function

// Action to handle logout
export const action = async ({ request }) => {
  return logout(request); // Call the logout function to destroy the session
};

// Loader to redirect if the user accesses this route directly
export const loader = async () => {
  return redirect("/login");
};
