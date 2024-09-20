import { Form, Link, useActionData } from "@remix-run/react";
import React, { useEffect, useState } from "react";

const ArticleForm = ({
  actionData,
  transitionState,
  defaultValues = null,
  categories = [],
  documentUrl = "",
}) => {
  const [clientErrors, setClientErrors] = useState({});
  const [formValues, setFormValues] = useState({
    articleName: defaultValues?.articleName || "",
    articleDescription: defaultValues?.articleDescription || "",
    categoryId: defaultValues?.categoryId || "",
  });

  // Clear client-side errors when form data changes
  useEffect(() => {
    if (transitionState === "idle") {
      setClientErrors({});
    }
  }, [transitionState]);

  // Update form values when defaultValues change (for edit form)
  useEffect(() => {
    if (
      defaultValues?.articleName !== formValues.articleName ||
      defaultValues?.articleDescription !== formValues.articleDescription ||
      defaultValues?.categoryId !== formValues.categoryId
    ) {
      setFormValues({
        articleName: defaultValues?.articleName || "",
        articleDescription: defaultValues?.articleDescription || "",
        categoryId: defaultValues?.categoryId || "",
      });
    }
  }, [defaultValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const validateForm = (event) => {
    const form = event.target;
    const errors = {};

    const articleName = form.articleName.value.trim();
    const articleDescription = form.articleDescription.value.trim();
    const categoryId = form.categoryId.value.trim();
    const document = form.document.files[0]; // Get the uploaded file

    if (!categoryId) {
      errors.categoryId = "Category is required";
    }

    if (!articleName || articleName.length < 2 || articleName.length > 255) {
      errors.articleName = "Article name must be between 2 and 255 characters";
    }

    if (
      !articleDescription ||
      articleDescription.length < 10 ||
      articleDescription.length > 1000
    ) {
      errors.articleDescription =
        "Article description must be between 10 and 1000 characters";
    }

    // Validate file input only if a file is provided (optional)
    if (document) {
      if (document.size > 2 * 1024 * 1024) {
        // 2MB file size limit
        errors.document = "File size must be less than 2MB";
      } else if (
        ![
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ].includes(document.type)
      ) {
        errors.document =
          "Invalid file type. Only PDF, DOCX, and TXT are allowed";
      }
    }

    setClientErrors(errors);

    // Prevent form submission if there are client-side errors
    if (Object.keys(errors).length > 0) {
      event.preventDefault();
    }
  };

  return (
    <>
      <Form
        method="post"
        className="validateJs"
        onSubmit={validateForm}
        encType="multipart/form-data"
      >
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="form-group">
              <label htmlFor="categoryId">
                Category<em>*</em>
              </label>
              <select
                name="categoryId"
                id="categoryId"
                className="form-control"
                value={formValues.categoryId}
                onChange={handleChange}
              >
                <option value="">--Select Category--</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              {clientErrors.categoryId && (
                <p className="text-danger">{clientErrors.categoryId}</p>
              )}
              {actionData?.errors?.categoryId && (
                <p className="text-danger">{actionData.errors.categoryId}</p>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="form-group">
              <label htmlFor="articleName">
                Article Name<em>*</em>
              </label>
              <input
                type="text"
                className="form-control"
                id="articleName"
                name="articleName"
                value={formValues.articleName}
                onChange={handleChange}
              />
              {clientErrors.articleName && (
                <p className="text-danger">{clientErrors.articleName}</p>
              )}
              {actionData?.errors?.articleName && (
                <p className="text-danger">{actionData.errors.articleName}</p>
              )}
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div className="form-group">
              <label htmlFor="articleDescription">
                Article Description<em>*</em>
              </label>
              <textarea
                rows="4"
                className="form-control"
                id="articleDescription"
                name="articleDescription"
                value={formValues.articleDescription}
                onChange={handleChange}
              />
              {clientErrors.articleDescription && (
                <p className="text-danger">{clientErrors.articleDescription}</p>
              )}
              {actionData?.errors?.articleDescription && (
                <p className="text-danger">
                  {actionData.errors.articleDescription}
                </p>
              )}
            </div>
          </div>

          {/* File upload field */}
          <div className="col-lg-6 col-md-6">
            <div className="form-group">
              <label htmlFor="document">
                Upload Document<em>*</em>
              </label>
              <input
                type="file"
                className="form-control"
                id="document"
                name="document"
                accept=".pdf, .docx, .txt"
              />
              {clientErrors.document && (
                <p className="text-danger">{clientErrors.document}</p>
              )}
              {actionData?.errors?.document && (
                <p className="text-danger">{actionData.errors.document}</p>
              )}
              {documentUrl && (
                <div>
                  <a href={documentUrl} download>
                    Download Current Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-12 mt-4 text-right">
            <button
              type="submit"
              className="btn btn-primary mb-2 mt-1"
              disabled={transitionState === "submitting"}
            >
              {transitionState === "submitting" ? "Submitting..." : "Submit"}
            </button>
            <Link to="/articles">
              <button
                type="button"
                className="btn btn-secondary ml-2 mb-2 mt-1"
              >
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ArticleForm;
