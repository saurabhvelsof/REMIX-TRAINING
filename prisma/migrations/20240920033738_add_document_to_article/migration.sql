/*
  Warnings:

  - You are about to drop the column `document` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `article` DROP FOREIGN KEY `Article_category_id_fkey`;

-- AlterTable
ALTER TABLE `article` ADD COLUMN `document` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `category` DROP COLUMN `document`;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
