import React from "react";

const BreadcrumbRow = ({ title, heading }) => {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">{heading}</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="javascript: void(0);">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="javascript: void(0);">{title}</a>
                </li>
                <li className="breadcrumb-item active">{heading}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BreadcrumbRow;
