/*
  Warnings:

  - You are about to drop the column `adminId` on the `topic` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `topic` DROP FOREIGN KEY `Topic_adminId_fkey`;

-- AlterTable
ALTER TABLE `topic` DROP COLUMN `adminId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `admin`;

-- AddForeignKey
ALTER TABLE `Topic` ADD CONSTRAINT `Topic_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_topic_fkey` FOREIGN KEY (`topic`) REFERENCES `Topic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
