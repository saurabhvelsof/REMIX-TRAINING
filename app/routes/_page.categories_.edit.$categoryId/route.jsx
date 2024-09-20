import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import BreadcrumbRow from "../../components/BreadcrumbRow";
import CategoryForm from "../../components/CategoryForm";
import { prisma } from "../../utils/prisma.server";
import { useEffect, useTransition } from "react";
// import { getUserSession, commitSession } from "../../utils/auth.server";

export const meta = () => {
  return [{ title: "Edit Category" }];
};

// Loader function to get the category details for editing

export const loader = async ({ params }) => {
  const { categoryId } = params;

  // Fetch the category details by ID
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
  });

  if (!category) {
    throw new Response("Category not found", { status: 404 });
  }

  return json({ category });
};

// Handling the action logic
export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { categoryId } = params;

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

  // Check if the category exists and if the name is unique for other categories
  const existingCategory = await prisma.category.findFirst({
    where: { category_name: name, NOT: { id: parseInt(categoryId) } },
  });

  if (existingCategory) {
    errors.categoryName = "Category with this name already exists.";
  }

  // If validation fails, return the errors back to the form
  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  try {
    // Attempt to update the category
    await prisma.category.update({
      where: { id: parseInt(categoryId) },
      data: {
        category_name: name,
        category_slug: slug,
      },
    });

    // Redirect with a success message
    return redirect("/categories?success=Category updated successfully");
  } catch (error) {
    // If there's an issue, catch the error and display it on the form
    console.log(error);
    return json(
      { server: "Failed to update category", errors },
      { status: 500 }
    );
  }
};

function route() {
  const transition = useTransition();
  const actionData = useActionData();
  const { category } = useLoaderData();

  return (
    <>
      {/* <!-- start page title --> */}
      <BreadcrumbRow title={"Category"} heading={"Edit Category"} />
      {/* <!-- end page title --> */}

      {/* <!-- end row --> */}

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <CategoryForm
                actionData={actionData}
                transitionState={transition.state}
                // Pass the existing category data to pre-fill the form
                defaultValues={{
                  categoryName: category.category_name,
                  categorySlug: category.category_slug,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default route;
