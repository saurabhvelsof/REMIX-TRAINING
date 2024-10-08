import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import ArticleForm from "../../components/ArticleForm";
import BreadcrumbRow from "../../components/BreadcrumbRow";
import { prisma } from "../../utils/prisma.server";
import { uploadHandler } from "../../utils/fileupload.server";
import { unstable_parseMultipartFormData } from "@remix-run/node";

// Loader to fetch categories for selection
export const loader = async () => {
  const categories = await prisma.category.findMany({
    select: { id: true, category_name: true },
    orderBy: { category_name: "asc" },
  });
  return json({ categories });
};

// Action to handle article submission
export const action = async ({ request }) => {
  // Parse the form data
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler()
  );

  const name = formData.get("articleName")?.trim();
  const description = formData.get("articleDescription")?.trim();
  const categoryId = parseInt(formData.get("categoryId"), 10);
  const document = formData.get("document"); // This will be the file path
  const documentPath = document?.toString(); // Convert file path to a string

  const errors = {};

  // Server-side validation
  if (!name || name.length < 2 || name.length > 255) {
    errors.articleName = "Article name must be between 2 and 255 characters";
  }

  if (!description || description.length < 10 || description.length > 1000) {
    errors.articleDescription =
      "Article description must be between 10 and 1000 characters";
  }

  if (!categoryId) {
    errors.categoryId = "Category is required";
  }

  if (!document) {
    errors.document = "Document is required";
  }

  // If validation fails, return the errors back to the form
  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  // Try to create the article
  try {
    await prisma.article.create({
      data: {
        article_name: name,
        article_description: description,
        category_id: categoryId,
        document: documentPath,
      },
    });

    // Redirect with a success message
    return redirect("/articles?success=Article created successfully");
  } catch (error) {
    console.error("Failed to create article", error);
    return json({ server: "Failed to create article" }, { status: 500 });
  }
};

const AddArticle = () => {
  const actionData = useActionData();
  const { categories } = useLoaderData();

  return (
    <>
      <BreadcrumbRow title={"Article"} heading={"Add Article"} />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <ArticleForm actionData={actionData} categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddArticle;
