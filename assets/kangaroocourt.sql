/* USE db-name */

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `Arguments` (
  `id` int(11) NOT NULL,
  `role` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `argument` text COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Comments` (
  `id` int(11) NOT NULL,
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Disputes` (
  `id` int(11) NOT NULL,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `imgUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `activeUntil` datetime NOT NULL,
  `bet` int(10) unsigned NOT NULL,
  `isPrivate` tinyint(1) NOT NULL,
  `defendantEmail` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DefendantId` int(11) DEFAULT NULL,
  `PlaintiffId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Juries` (
  `id` int(11) NOT NULL,
  `vote` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `DisputeId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `UserInvitations` (
  `id` int(11) NOT NULL,
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `code` text COLLATE utf8_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `Users` (
  `id` int(11) NOT NULL,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `imgUrl` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


ALTER TABLE `Arguments`
ADD PRIMARY KEY (`id`),
ADD KEY `DisputeId` (`DisputeId`),
ADD KEY `UserId` (`UserId`);

ALTER TABLE `Comments`
ADD PRIMARY KEY (`id`),
ADD KEY `DisputeId` (`DisputeId`),
ADD KEY `UserId` (`UserId`);

ALTER TABLE `Disputes`
ADD PRIMARY KEY (`id`),
ADD KEY `DefendantId` (`DefendantId`),
ADD KEY `PlaintiffId` (`PlaintiffId`);

ALTER TABLE `Juries`
ADD PRIMARY KEY (`id`),
ADD KEY `DisputeId` (`DisputeId`),
ADD KEY `UserId` (`UserId`);

ALTER TABLE `UserInvitations`
ADD PRIMARY KEY (`id`);

ALTER TABLE `Users`
ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`),
ADD UNIQUE KEY `imgUrl` (`imgUrl`);


ALTER TABLE `Arguments`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Comments`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Disputes`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Juries`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `UserInvitations`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Arguments`
ADD CONSTRAINT `Arguments_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `Arguments_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Comments`
ADD CONSTRAINT `Comments_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `Comments_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Disputes`
ADD CONSTRAINT `Disputes_ibfk_1` FOREIGN KEY (`DefendantId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `Disputes_ibfk_2` FOREIGN KEY (`PlaintiffId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Juries`
ADD CONSTRAINT `Juries_ibfk_1` FOREIGN KEY (`DisputeId`) REFERENCES `Disputes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `Juries_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
