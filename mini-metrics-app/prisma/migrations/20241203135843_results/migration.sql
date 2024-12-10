/*
  Warnings:

  - You are about to drop the `hour` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beginAt` to the `Formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endAt` to the `Formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `Formula` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Formula` ADD COLUMN `authorId` INTEGER NOT NULL,
    ADD COLUMN `beginAt` VARCHAR(191) NOT NULL,
    ADD COLUMN `endAt` VARCHAR(191) NOT NULL,
    ADD COLUMN `period` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Hour`;

-- CreateTable
CREATE TABLE `Result` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `formulaId` INTEGER NOT NULL,
    `result` JSON NOT NULL,
    `type` ENUM('number', 'numberList', 'string', 'stringList', 'object', 'objectList') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Formula` ADD CONSTRAINT `Formula_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_formulaId_fkey` FOREIGN KEY (`formulaId`) REFERENCES `Formula`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
