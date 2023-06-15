-- AlterTable
ALTER TABLE `post` ADD COLUMN `report` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `reply` ADD COLUMN `report` BOOLEAN NOT NULL DEFAULT false;
