/*
  Warnings:

  - You are about to drop the column `topic` on the `post` table. All the data in the column will be lost.
  - Added the required column `topicId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_topic_fkey`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `topic`,
    ADD COLUMN `topicId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `Topic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
