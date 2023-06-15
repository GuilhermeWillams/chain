/*
  Warnings:

  - You are about to alter the column `file` on the `script` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `script` MODIFY `file` VARCHAR(191) NOT NULL;
