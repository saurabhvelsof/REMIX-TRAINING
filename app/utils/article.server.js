import { prisma } from "./prisma.server";

// Get an Article by ID
export async function getArticleById(id) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true, // Include related category details
      },
    });
    return article;
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    throw new Error("Could not fetch article");
  }
}

// Get all Articles
export async function getAllArticles() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        category: true, // Include related category details
      },
      orderBy: {
        updated_at: 'desc', // Order by updated_at
      },
    });
    return articles;
  } catch (error) {
    console.error("Error fetching all articles:", error);
    throw new Error("Could not fetch articles");
  }
}

// Create a new Article
export async function createArticle(name, description, categoryId, document) {
  try {
    const article = await prisma.article.create({
      data: {
        article_name: name, // Matches the schema field 'article_name'
        article_description: description, // Matches the schema field 'article_description'
        category_id: parseInt(categoryId), // Matches the schema field 'category_id'
        status: 1, // Default status set to 1
        document: document || "", // Save the document path if provided
        created_at: new Date(), // Ensure created_at is set
      },
    });
    return article;
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error("Could not create article");
  }
}

// Update an existing Article
export async function updateArticle(id, name, description, categoryId, document) {
  try {
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        article_name: name, // Matches the schema field 'article_name'
        article_description: description, // Matches the schema field 'article_description'
        category_id: parseInt(categoryId), // Matches the schema field 'category_id'
        document: document || undefined, // Update document only if provided
        updated_at: new Date(), // Ensure updated_at is set to the current time
      },
    });
    return article;
  } catch (error) {
    console.error("Error updating article:", error);
    throw new Error("Could not update article");
  }
}

// Delete an Article by ID
export async function deleteArticleById(id) {
  try {
    const article = await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    return article;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw new Error("Could not delete article");
  }
}
