/*
  Warnings:

  - Added the required column `shardKey` to the `Formula` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ANPRData` ADD COLUMN `shardKey` BIGINT NULL;

-- AlterTable
ALTER TABLE `Formula` ADD COLUMN `shardKey` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `MapData` ADD COLUMN `shardKey` BIGINT NULL;

-- CreateTable
CREATE TABLE `ShardRegistry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shardId` INTEGER NOT NULL,
    `host` VARCHAR(191) NOT NULL,
    `minKey` BIGINT NOT NULL,
    `maxKey` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ShardRegistry_shardId_key`(`shardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
