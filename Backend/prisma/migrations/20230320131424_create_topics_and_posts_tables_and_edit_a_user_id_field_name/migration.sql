/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dataInscricao` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `idUser` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `nivelCargo` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `user` table. All the data in the column will be lost.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleLevel` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `dataInscricao`,
    DROP COLUMN `idUser`,
    DROP COLUMN `nivelCargo`,
    DROP COLUMN `senha`,
    DROP COLUMN `telefone`,
    ADD COLUMN `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `roleLevel` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `Topic` (
    `id` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `postDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastEdit` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `topic` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
