-- CreateTable
CREATE TABLE `ANPRData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `licensePlate` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `vehicleType` VARCHAR(191) NOT NULL,
    `speed` INTEGER NOT NULL,
    `location` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MapData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roadId` VARCHAR(191) NOT NULL,
    `roadName` VARCHAR(191) NOT NULL,
    `vehicleDensity` INTEGER NOT NULL,
    `avgSpeed` INTEGER NOT NULL,
    `congestionLevel` VARCHAR(191) NOT NULL,
    `accidentsReported` INTEGER NOT NULL,
    `weatherCondition` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
