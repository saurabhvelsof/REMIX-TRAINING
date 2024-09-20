import { Form, json, Link, redirect, useLoaderData } from "@remix-run/react";
import { prisma } from "../../utils/prisma.server";
import { requireUserId } from "../../utils/auth.server";
import { useEffect } from "react";

// Constants for pagination
const ARTICLES_PER_PAGE = 5;
const VISIBLE_PAGE_COUNT = 5; // Show 5 page numbers at a time

export const meta = () => {
  return [{ title: "Article" }];
};

// Loader to fetch articles and handle pagination
export const loader = async ({ request }) => {
  await requireUserId(request);

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  // Fetch articles with pagination
  const articles = await prisma.article.findMany({
    skip: offset,
    take: ARTICLES_PER_PAGE,
    include: {
      category: true, // Assuming Article has relation to Category
    },
    orderBy: {
      updated_at: "desc", // Ordering articles by updated_at in descending order
    },
  });

  // Get total number of articles
  const totalArticles = await prisma.article.count();

  return json({
    articles,
    totalArticles,
    currentPage: page,
    totalPages: Math.ceil(totalArticles / ARTICLES_PER_PAGE),
  });
};

// Action to delete the article
export const action = async ({ request }) => {
  const formData = await request.formData();
  const articleId = formData.get("articleId");

  try {
    await prisma.article.delete({
      where: { id: parseInt(articleId) },
    });
    return redirect("/articles?success=Article deleted successfully");
  } catch (error) {
    console.error("Failed to delete article:", error);
    return json({ error: "Failed to delete article." }, { status: 500 });
  }
};

export default function Article() {
  const { articles, totalArticles, currentPage, totalPages } = useLoaderData();

  // Determine the current range of visible page numbers
  const startPage =
    Math.floor((currentPage - 1) / VISIBLE_PAGE_COUNT) * VISIBLE_PAGE_COUNT + 1;
  const endPage = Math.min(startPage + VISIBLE_PAGE_COUNT - 1, totalPages);

  // Function to handle pagination
  const paginate = (page) => {
    window.location.href = `?page=${page}`;
  };

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

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">Article List</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Article</li>
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
                    <h4 className="card-title">Article</h4>
                  </div>
                  <div className="col-lg-9 text-right">
                    <Link
                      to={`/articles/add`}
                      className="btn btn-sm btn-success"
                    >
                      <i className="mdi mdi-plus"></i> Add Article
                    </Link>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table mb-0 listingData dt-responsive">
                  <thead>
                    <tr>
                      <th>S. No.</th>
                      <th>Article Name</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article, index) => (
                      <tr key={article.id}>
                        <th scope="row">
                          {(currentPage - 1) * ARTICLES_PER_PAGE + index + 1}
                        </th>
                        <td>{article.article_name}</td>
                        <td>{article.category?.category_name || "N/A"}</td>
                        <td>
                          <span
                            className={`badge badge-pill ${
                              article.status === 1
                                ? "badge-success"
                                : "badge-danger"
                            }`}
                          >
                            {article.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/articles/edit/${article.id}`}
                            className="text-primary"
                          >
                            <i className="mdi mdi-square-edit-outline"></i>
                          </Link>
                          <Form method="post" className="d-inline">
                            <input
                              type="hidden"
                              name="articleId"
                              value={article.id}
                            />
                            <button
                              type="submit"
                              className="text-danger btn btn-link p-0"
                              title="Delete Article"
                              onClick={(e) => {
                                if (
                                  !window.confirm(
                                    "Are you sure you want to delete this article?"
                                  )
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <i className="mdi mdi-circle-off-outline"></i>
                            </button>
                          </Form>
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
                    role="status"
                    aria-live="polite"
                  >
                    Showing {(currentPage - 1) * ARTICLES_PER_PAGE + 1} to{" "}
                    {Math.min(currentPage * ARTICLES_PER_PAGE, totalArticles)}{" "}
                    of {totalArticles} entries
                  </div>
                </div>
                <div className="col-sm-12 col-md-7 dataTables_wrapper">
                  <div className="dataTables_paginate paging_simple_numbers">
                    <ul className="pagination">
                      <li
                        className={`paginate_button page-item previous ${
                          startPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <a
                          href="#"
                          onClick={() =>
                            paginate(startPage - VISIBLE_PAGE_COUNT)
                          }
                          className="page-link"
                        >
                          Previous
                        </a>
                      </li>

                      {/* Render the visible pages */}
                      {Array.from({ length: endPage - startPage + 1 }).map(
                        (_, index) => {
                          const pageNumber = startPage + index;
                          return (
                            <li
                              key={pageNumber}
                              className={`paginate_button page-item ${
                                pageNumber === currentPage ? "active" : ""
                              }`}
                            >
                              <a
                                href="#"
                                onClick={() => paginate(pageNumber)}
                                className="page-link"
                              >
                                {pageNumber}
                              </a>
                            </li>
                          );
                        }
                      )}

                      <li
                        className={`paginate_button page-item next ${
                          endPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <a
                          href="#"
                          onClick={() => paginate(endPage + 1)}
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
