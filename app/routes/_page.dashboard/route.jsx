import { requireUserId } from "../../utils/auth.server";

export const meta = () => {
  return [{ title: "Dashboard" }];
};

export const loader = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function Dashboard() {
  return (
    <>
      {/* <!-- start page title --> */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">Dashboard</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="javascript: void(0);">Home</a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- end page title --> */}

      {/* <!-- start row --> */}

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div>Welcome to Dashboard.</div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- end row --> */}
    </>
  );
}
