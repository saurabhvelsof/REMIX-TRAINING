import { Form, json, redirect, useActionData } from "@remix-run/react";
import BreadcrumbRow from "../../components/BreadcrumbRow";
import CategoryForm from "../../components/CategoryForm";
import { prisma } from "../../utils/prisma.server";
import { useEffect, useTransition } from "react";
// import { getUserSession, commitSession } from "../../utils/auth.server";

export const meta = () => {
  return [{ title: "Add Category" }];
};

// Handling the action logic

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const errors = {};

  const name = data.categoryName?.trim();
  const slug = data.categorySlug?.trim();

  // Server-side validation
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

  // Check for duplicate category name
  const existingCategory = await prisma.category.findUnique(  {
    where: { category_name: name },
  });

  if (existingCategory) {
    errors.categoryName = "Category with this name already exists.";
  }

  // If validation fails, return the errors back to the form
  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  try {
    // Attempt to create the category
    await prisma.category.create({
      data: {
        category_name: name,
        category_slug: slug,
      },
    });

    // Redirect with a success message
    return redirect("/categories?success=Category created successfully");
  } catch (error) {
    // If there's an issue, catch the error and display it on the form
    console.log(error);
    return json(
      { server: "Failed to create category", errors },
      { status: 500 }
    );
  }
};

function route() {
  const transition = useTransition();
  const actionData = useActionData();

  return (
    <>
      {/* <!-- start page title --> */}
      <BreadcrumbRow title={"Category"} heading={"Add Categories"} />
      {/* <!-- end page title --> */}

      {/* <!-- end row --> */}

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <CategoryForm
                actionData={actionData}
                transitionState={transition.state}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default route;
