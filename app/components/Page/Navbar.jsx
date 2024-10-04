import { Form, Link } from "@remix-run/react";
import LogoSrc from "../../assets/images/velocity_logo.png?url";
export default function Navbar({ user }) {
  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to={`/dashboard`} className="logo logo-light">
                <span className="logo-sm">
                  <img src={LogoSrc} alt="" height="40" />
                </span>
                <span className="logo-lg">
                  <img src={LogoSrc} alt="" height="" />
                </span>
              </Link>
            </div>
          </div>

          <div className="d-flex pr-2">
            <div className="dropdown d-flex">
              <span className="d-none d-xl-inline-block mr-2" key="t-henry">
                Welcome, {user}
              </span>
              &nbsp;&nbsp;
              <Form action="/logout" method="post">
                <button type="submit" className="btn btn-link p-0">
                  Logout
                </button>
              </Form>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
