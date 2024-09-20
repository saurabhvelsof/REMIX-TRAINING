import {
  Link, Outlet
} from "@remix-run/react";

import appStylesHref from "../../assets/css/bootstrap.min.css?url";
import appIconStylesHref from "../../assets/css/icons.min.css?url";
import appAppStylesHref from "../../assets/css/app.min.css?url";
import authShortcutIconHref from "../../assets/images/favicon.ico?url";

export const links = () => [
  { rel: "shortcut icon", href: authShortcutIconHref },
  {
    id: "bootstrap-style",
    rel: "stylesheet",
    href: appStylesHref,
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
];

export default function AuthLayout() {
  return (
    <>
      <div className="home-btn d-none d-sm-block">
        <Link to={"/"}>
          <div className="text-dark">
            <i className="fas fa-home h2"></i>
          </div>
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-5">
              <div className="card overflow-hidden">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
