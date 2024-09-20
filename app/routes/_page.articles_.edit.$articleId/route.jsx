import { json, redirect, useActionData, useLoaderData } from "@remix-run/react";
import ArticleForm from "../../components/ArticleForm";
import BreadcrumbRow from "../../components/BreadcrumbRow";
import { prisma } from "../../utils/prisma.server";

export const meta = () => {
  return [{ title: "Edit Article" }];
};

// Loader to fetch the article and categories for selection
export const loader = async ({ params }) => {
  const articleId = params.articleId;

  // Fetch the article by ID
  const article = await prisma.article.findUnique({
    where: { id: parseInt(articleId) },
    include: { category: true }, // Including related category if needed
  });

  // Fetch all categories for the dropdown
  const categories = await prisma.category.findMany({
    select: { id: true, category_name: true },
  });

  if (!article) {
    throw new Response("Article not found", { status: 404 });
  }

  return json({ article, categories });
};

// Action to handle the form submission for updating the article
export const action = async ({ request, params }) => {
  // Use dynamic import inside the action to ensure it's executed only in the server environment
  const {
    unstable_composeUploadHandlers,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
    writeAsyncIterableToWritable,
  } = await import("@remix-run/node");

  const { createWriteStream } = await import("fs");
  const { join } = await import("path");
  const { existsSync, mkdirSync } = await import("fs");

  // Ensure the directory for uploads exists
  const uploadDirectory = join(process.cwd(), "uploads");
  if (!existsSync(uploadDirectory)) {
    mkdirSync(uploadDirectory, { recursive: true });
  }

  // Function to save file to disk
  async function saveFileToDisk(data, filename) {
    const filePath = join(uploadDirectory, filename); // Full path to save file

    const writeStream = createWriteStream(filePath);
    await writeAsyncIterableToWritable(data, writeStream); // Write file stream to disk

    return filename; // Return the saved file path
  }

  const uploadHandler = unstable_composeUploadHandlers(
    // Custom handler to save image files
    async ({ name, data, filename }) => {
      if (name !== "document" || !filename) {
        return undefined;
      }
      const savedFilePath = await saveFileToDisk(data, filename); // Save file to disk
      return savedFilePath;
    },
    // Fallback to in-memory handler for other fields
    unstable_createMemoryUploadHandler()
  );

  // Parse the form data
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  // Get the file path from the formData
  const filePath = formData.get("document");
  console.log("File saved at:", filePath);

  const articleName = formData.get("articleName")?.trim();
  const articleDescription = formData.get("articleDescription")?.trim();
  const categoryId = parseInt(formData.get("categoryId"), 10);
  const document = formData.get("document"); // This will be the file path

  const errors = {};

  // Validate form inputs
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

  if (!categoryId) {
    errors.categoryId = "Category is required";
  }

  console.log("I am here")

  // If there are validation errors, return them to the form
  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  // Update the article
  try {
    // Fetch the current article to check if we need to keep the existing document
    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(params.articleId) },
    });

    // If a new document is uploaded, use it, otherwise, keep the existing document
    const documentPath = document
      ? document?.toString()
      : existingArticle.document;

    await prisma.article.update({
      where: { id: parseInt(params.articleId) },
      data: {
        article_name: articleName,
        article_description: articleDescription,
        category_id: categoryId,
        document: documentPath, // Keep or update the document
      },
    });

    // Redirect to article list with success message
    return redirect("/articles?success=Article updated successfully");
  } catch (error) {
    console.error("Failed to update article:", error);
    return json({ server: "Failed to update article" }, { status: 500 });
  }
};

const EditArticle = () => {
  const { article, categories } = useLoaderData();
  const actionData = useActionData();

  return (
    <>
      <BreadcrumbRow title={"Article"} heading={"Edit Article"} />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <ArticleForm
                actionData={actionData}
                defaultValues={{
                  articleName: article.article_name,
                  articleDescription: article.article_description,
                  categoryId: article.category_id,
                }}
                categories={categories}
                documentUrl={`/download/${article?.document}`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditArticle;
