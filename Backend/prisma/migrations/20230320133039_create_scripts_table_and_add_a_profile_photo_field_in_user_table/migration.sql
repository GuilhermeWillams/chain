/*
  Warnings:

  - Added the required column `profilePhoto` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `profilePhoto` LONGBLOB NOT NULL;

-- CreateTable
CREATE TABLE `Script` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `file` LONGBLOB NOT NULL,
    `equipModel` VARCHAR(191) NOT NULL,
    `equipType` VARCHAR(191) NOT NULL,
    `equipBrand` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Script` ADD CONSTRAINT `Script_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
