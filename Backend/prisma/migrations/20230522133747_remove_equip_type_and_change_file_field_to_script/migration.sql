/*
  Warnings:

  - You are about to drop the column `equipType` on the `script` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `script` table. All the data in the column will be lost.
  - Added the required column `script` to the `Script` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `script` DROP COLUMN `equipType`,
    DROP COLUMN `file`,
    ADD COLUMN `script` VARCHAR(191) NOT NULL;
