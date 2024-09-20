import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed 20 categories
  const categories = [];
  for (let i = 1; i <= 20; i++) {
    const category = await prisma.category.create({
      data: {
        category_name: `Category ${i}`,
        category_slug: `category-${i}`,
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    categories.push(category);
  }

  // Seed 100 articles
  for (let j = 1; j <= 100; j++) {
    const randomCategoryId =
      categories[Math.floor(Math.random() * categories.length)].id;
    await prisma.article.create({
      data: {
        article_name: `Article ${j}`,
        article_description: `This is the description for Article ${j}.`,
        category_id: randomCategoryId,
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
