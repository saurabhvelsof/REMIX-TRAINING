import { prisma } from "./prisma.server";

// Get a Category by ID
export async function getCategoryById(id) {
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) },
  });
  return category;
}

// Get all Categories
export async function getAllCategories() {
  const categories = await prisma.category.findMany({});
  return categories;
}

// Create a new Category
export async function createCategory(name, slug) {
  console.log({ name, slug });
  const category = await prisma.category.create({
    data: {
      category_name: name,
      category_slug: slug,
    },
  });
  return category;
}

// Update an existing Category
export async function updateCategory(id, name, slug) {
  const category = await prisma.category.update({
    where: { id: parseInt(id) },
    data: {
      category_name: name,
      category_slug: slug,
    },
  });
  return category;
}

// Delete a Category by ID
export async function deleteCategoryById(id) {
  const category = await prisma.category.delete({
    where: { id: parseInt(id) },
  });
  return category;
}

// Get an Article by ID
export async function getArticleById(id) {
  const article = await prisma.article.findUnique({
    where: { id: parseInt(id) },
  });
  return article;
}

// Get all Articles
export async function getAllArticles() {
  const articles = await prisma.article.findMany({});
  return articles;
}

// Create a new Article
export async function createArticle(name, description, categoryId) {
  const article = await prisma.article.create({
    data: {
      article_name: name,
      article_description: description,
      category_id: parseInt(categoryId),
    },
  });
  return article;
}

// Update an existing Article
export async function updateArticle(id, name, description, categoryId) {
  const article = await prisma.article.update({
    where: { id: parseInt(id) },
    data: {
      article_name: name,
      article_description: description,
      category_id: parseInt(categoryId),
    },
  });
  return article;
}

// Delete an Article by ID
export async function deleteArticleById(id) {
  const article = await prisma.article.delete({
    where: { id: parseInt(id) },
  });
  return article;
}
