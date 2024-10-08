import { Link } from "@remix-run/react";

// Left Sidebar of the app having menus like Dashboard, Article and Category.
export default function Sidebar() {
  return (
    <>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          {/* <!--- Sidemenu --> */}
          <div id="sidebar-menu">
            {/* <!-- Left Menu Start --> */}
            <ul className="metismenu list-unstyled" id="side-menu">
              <li>
                <Link to={`/dashboard`} className="waves-effect">
                  <i className="mdi mdi-file-document-box-outline"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to={`/articles`} className="waves-effect">
                  <i className="mdi mdi-weather-night"></i>
                  <span>Article</span>
                </Link>
              </li>
              <li>
                <Link to={`/categories`} className="waves-effect">
                  <i className="mdi mdi-weather-night"></i>
                  <span>Category</span>
                </Link>
              </li>
            </ul>
          </div>
          {/* <!-- Sidebar --> */}
        </div>
      </div>
    </>
  );
}
