import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import appBootstrapStylesHref from "../../assets/css/bootstrap.min.css?url";
import appIconStylesHref from "../../assets/css/icons.min.css?url";
import appAppStylesHref from "../../assets/css/app.min.css?url";
import authShortcutIconHref from "../../assets/images/favicon.ico?url";
import appStylesHref from "../../assets/css/style.css?url";
// import dataTableOneHref from "../../assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css?url";
// import dataTableTwoHref from "../../assets/libs/datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css?url";
import dataTableThreeHref from "../../assets/libs/datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css?url";
import Navbar from "../../components/Page/Navbar";
import Footer from "../../components/Page/Footer";
import Sidebar from "../../components/Page/Sidebar";
import { getUser, requireUserId } from "../../utils/auth.server";

export const links = () => [
  { rel: "shortcut icon", href: authShortcutIconHref },
  {
    id: "bootstrap-style",
    rel: "stylesheet",
    href: appBootstrapStylesHref,
    type: "text/css",
  },
  {
    rel: "stylesheet",
    href: appIconStylesHref,
    type: "text/css",
  },
  {
    id: "app-style",
    rel: "stylesheet",
    href: appAppStylesHref,
    type: "text/css",
  },
  {
    href: appStylesHref,
    rel: "stylesheet",
    type: "text/css",
  },
  // {
  //   href: dataTableOneHref,
  //   rel: "stylesheet",
  //   type: "text/css",
  // },
  // {
  //   href: dataTableTwoHref,
  //   rel: "stylesheet",
  //   type: "text/css",
  // },
  {
    href: dataTableThreeHref,
    rel: "stylesheet",
    type: "text/css",
  },
];

// Loader function to fetch the logged-in user
export const loader = async ({ request }) => {
  await requireUserId(request);

  const user = await getUser(request); // Fetch the user from session

  return { user: user?.email || null }; // Return user to be used in the component
};

export default function PageLayout() {
  const { user } = useLoaderData(); // Get user data from loader
  return (
    <div data-sidebar="dark">
      <div id="layout-wrapper">
        <Navbar user={user} />
        <Sidebar />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <Outlet />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
