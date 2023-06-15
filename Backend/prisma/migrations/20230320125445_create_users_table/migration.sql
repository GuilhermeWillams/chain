-- CreateTable
CREATE TABLE `User` (
    `idUser` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nivelCargo` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `dataInscricao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
