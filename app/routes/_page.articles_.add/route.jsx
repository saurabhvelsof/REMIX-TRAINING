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
      if (name !== "document") {
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

  // Now you can use the filePath for further operations or save it to the database
  console.log("File saved at:", filePath);

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
