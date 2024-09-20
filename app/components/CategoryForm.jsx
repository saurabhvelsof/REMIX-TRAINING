import { Form, Link, useActionData } from "@remix-run/react";
import React, { useEffect, useState } from "react";

const CategoryForm = ({
  actionData,
  transitionState,
  defaultValues = null,
}) => {
  // const actionData = useActionData();
  const [clientErrors, setClientErrors] = useState({});
  const [formValues, setFormValues] = useState({
    categoryName: defaultValues?.categoryName || "",
    categorySlug: defaultValues?.categorySlug || "",
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
      defaultValues &&
      (defaultValues?.categoryName || defaultValues?.categorySlug)
    ) {
      setFormValues({
        categoryName: defaultValues?.categoryName || "",
        categorySlug: defaultValues?.categorySlug || "",
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

    const name = form.categoryName.value.trim();
    const slug = form.categorySlug.value.trim();

    if (!name) {
      errors.categoryName = "Category name is required";
    } else if (name.length < 3 || name.length > 255) {
      errors.categoryName = "Name must be between 3 and 255 characters";
    }

    if (!slug) {
      errors.categorySlug = "Category slug is required";
    } else if (slug.length < 3 || slug.length > 60) {
      errors.categorySlug = "Slug must be between 3 and 60 characters";
    }

    setClientErrors(errors);

    if (Object.keys(errors).length > 0) {
      event.preventDefault(); // Prevent form submission if there are client-side errors
    }
  };

  return (
    <>
      <Form method="post" className="validateJs" onSubmit={validateForm}>
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="form-group">
              <label htmlFor="categoryName">
                Category Name<em>*</em>
              </label>
              <input
                type="text"
                className="form-control"
                id="categoryName"
                name="categoryName"
                placeholder=""
                value={formValues.categoryName}
                onChange={handleChange}
              />
              {/* Client-side and server-side errors */}
              {clientErrors.categoryName && (
                <p className="text-danger">{clientErrors.categoryName}</p>
              )}
              {actionData?.errors?.categoryName && (
                <p className="text-danger">{actionData.errors.categoryName}</p>
              )}
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div className="form-group">
              <label htmlFor="categorySlug">
                Category Slug<em>*</em>
              </label>
              <input
                type="text"
                className="form-control"
                id="categorySlug"
                name="categorySlug"
                placeholder=""
                value={formValues.categorySlug}
                onChange={handleChange}
              />
              {/* Client-side and server-side errors */}
              {clientErrors.categorySlug && (
                <p className="text-danger">{clientErrors.categorySlug}</p>
              )}
              {actionData?.errors?.categorySlug && (
                <p className="text-danger">{actionData.errors.categorySlug}</p>
              )}
            </div>
          </div>
        </div>

        {/* Display server error */}
        {actionData?.server && (
          <div className="alert alert-danger" role="alert">
            {actionData.server}
          </div>
        )}

        <div className="row">
          <div className="col-lg-12 col-md-12 mt-4 text-right">
            <button
              type="submit"
              className="btn btn-primary mb-2 mt-1"
              disabled={transitionState === "submitting"}
            >
              {transitionState === "submitting" ? "Submitting..." : "Submit"}
            </button>
            <Link to="/categories">
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

export default CategoryForm;
