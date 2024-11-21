-- k8s/db/init.sql

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS mannekendata;

-- Create user with proper permissions for all hosts
CREATE USER IF NOT EXISTS 'manneken'@'%' IDENTIFIED BY 'manneken123';
CREATE USER IF NOT EXISTS 'manneken'@'localhost' IDENTIFIED BY 'manneken123';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON mannekendata.* TO 'manneken'@'%';
GRANT ALL PRIVILEGES ON mannekendata.* TO 'manneken'@'localhost';

-- Grant replication privileges for distributed setup
GRANT REPLICATION SLAVE ON *.* TO 'manneken'@'%';
GRANT REPLICATION SLAVE ON *.* TO 'manneken'@'localhost';

-- Apply the privileges
FLUSH PRIVILEGES;

-- Switch to the database
USE mannekendata;

-- Create your tables if needed (these match your Prisma schema)
CREATE TABLE IF NOT EXISTS `ANPRData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `licensePlate` varchar(191) NOT NULL,
  `timestamp` datetime(3) NOT NULL,
  `vehicleType` varchar(191) NOT NULL,
  `speed` int NOT NULL,
  `location` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `MapData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roadId` varchar(191) NOT NULL,
  `roadName` varchar(191) NOT NULL,
  `vehicleDensity` int NOT NULL,
  `avgSpeed` int NOT NULL,
  `congestionLevel` varchar(191) NOT NULL,
  `accidentsReported` int NOT NULL,
  `weatherCondition` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Formula` (
  `id` int NOT NULL AUTO_INCREMENT,
  `formula` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
);