import { Form, json, Link, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { prisma } from "../../utils/prisma.server";

export const meta = () => {
  return [{ title: "Category" }];
};

// Constants for pagination
const CATEGORIES_PER_PAGE = 5;

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;

  // Calculate the offset for paginationP
  const offset = (page - 1) * CATEGORIES_PER_PAGE;

  // Fetch categories with pagination
  const categories = await prisma.category.findMany({
    skip: offset,
    take: CATEGORIES_PER_PAGE,
    orderBy: {
      updated_at: "desc", // Ordering articles by updated_at in descending order
    },
  });

  

  // Fetch total number of categories to calculate pagination
  const totalCategories = await prisma.category.count();

  return json({
    categories,
    totalCategories,
    currentPage: page,
    totalPages: Math.ceil(totalCategories / CATEGORIES_PER_PAGE),
  });
};

// Action to delete the category
export const action = async ({ request }) => {
  const formData = await request.formData();
  const categoryId = formData.get("categoryId");

  try {
    await prisma.category.delete({
      where: { id: parseInt(categoryId) },
    });
    return redirect("/categories?success=Category deleted successfully");
  } catch (error) {
    return json({ error: "Failed to delete category." }, { status: 500 });
  }
};

export default function Categories() {
  const { categories, totalCategories, currentPage, totalPages } =
    useLoaderData();

  // Show success notification if redirected with success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successMessage = params.get("success");

    if (successMessage) {
      alert(successMessage);
      params.delete("success");
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // Function to handle pagination links
  const paginate = (page) => {
    window.location.href = `?page=${page}`;
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">Category List</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Category</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="TableHeader">
                <div className="row">
                  <div className="col-lg-3">
                    <h4 className="card-title">Category</h4>
                  </div>
                  <div className="col-lg-9 text-right">
                    <div className="headerButtons">
                      <Link to="/categories/add">
                        <div className="btn btn-sm btn-success">
                          <i className="mdi mdi-plus"></i> Add Category
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table
                  className="table mb-0 listingData dt-responsive"
                  id="datatable"
                >
                  <thead>
                    <tr>
                      <th>S. No.</th>
                      <th>Category ID</th>
                      <th>Category Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category.id}>
                        <th scope="row">{(currentPage - 1) * 5 + index + 1}</th>
                        <td>{category.id}</td>
                        <td>{category.category_name}</td>
                        <td>
                          <span
                            className={`badge badge-pill ${
                              category.status === 1
                                ? "badge-success"
                                : "badge-danger"
                            }`}
                          >
                            {category.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/categories/edit/${category.id}`}
                            className="text-primary"
                            title="Edit Category"
                          >
                            <i className="mdi mdi-square-edit-outline"></i>
                          </Link>
                          <Form method="post" style={{ display: "inline" }}>
                            <input
                              type="hidden"
                              name="categoryId"
                              value={category.id}
                            />
                            <button
                              type="submit"
                              className="text-danger btn btn-link"
                              title="Delete Category"
                              onClick={(e) => {
                                if (
                                  !window.confirm(
                                    "Are you sure you want to delete this category?"
                                  )
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <i className="mdi mdi-circle-off-outline"></i>
                            </button>
                          </Form>
                          {/* <a
                            href="#"
                            className="text-danger"
                            title="Delete Category"
                          >
                            <i className="mdi mdi-circle-off-outline"></i>
                          </a> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row pt-3">
                <div className="col-sm-12 col-md-5">
                  <div
                    className="dataTables_info"
                    id="datatable_info"
                    role="status"
                    aria-live="polite"
                  >
                    Showing {(currentPage - 1) * 5 + 1} to{" "}
                    {Math.min(currentPage * 5, totalCategories)} of{" "}
                    {totalCategories} entries
                  </div>
                </div>
                <div className="col-sm-12 col-md-7 dataTables_wrapper">
                  <div
                    className="dataTables_paginate paging_simple_numbers"
                    id="datatable_paginate"
                  >
                    <ul className="pagination">
                      <li
                        className={`paginate_button page-item previous ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <a
                          href="#"
                          onClick={() => paginate(currentPage - 1)}
                          className="page-link"
                        >
                          Previous
                        </a>
                      </li>

                      {Array.from({ length: totalPages }).map(
                        (_, pageIndex) => (
                          <li
                            key={pageIndex}
                            className={`paginate_button page-item ${
                              pageIndex + 1 === currentPage ? "active" : ""
                            }`}
                          >
                            <a
                              href="#"
                              onClick={() => paginate(pageIndex + 1)}
                              className="page-link"
                            >
                              {pageIndex + 1}
                            </a>
                          </li>
                        )
                      )}

                      <li
                        className={`paginate_button page-item next ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <a
                          href="#"
                          onClick={() => paginate(currentPage + 1)}
                          className="page-link"
                        >
                          Next
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
